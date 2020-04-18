/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { AutowiredOptions } from "../models/autowired-options";
import { ClassConstructor } from "../typings/class-constructor";
import { AutowiredLifetimes } from "../models/autowired-lifetimes";
import { OverrideOptions } from "../models/override-options";

export class DI {

    public static defaultOptions: AutowiredOptions = {
        lifeTime: AutowiredLifetimes.SINGLETON
    };

    public autowired: (options?: AutowiredOptions) => PropertyDecorator;
    public reset: () => void;
    public resolve: <T extends ClassConstructor>(
        constructor: T,
        options?: AutowiredOptions,
        caller?: object,
        propertyKey?: string | symbol
    ) => T;
    public singleton: <T extends ClassConstructor>(constructor: T, options?: AutowiredOptions) => T;
    public instance: <T extends ClassConstructor>(constructor: T, options?: AutowiredOptions) => T;
    public override: (from: ClassConstructor, to: ClassConstructor, options?: AutowiredOptions) => void;

    protected singletonsList: Map<ClassConstructor, object> = new Map<ClassConstructor, object>();
    protected overrideList: Map<ClassConstructor, OverrideOptions> = new Map<ClassConstructor, OverrideOptions>();

    constructor() {
        this.autowired = (options?: AutowiredOptions) => this.makeAutowired(options);
        this.reset = () => this.makeReset();

        this.resolve = <T extends ClassConstructor>(
            constructor: T,
            options?: AutowiredOptions,
            caller?: object,
            propertyKey?: string | symbol
        ) => this.makeResolve(constructor, options, caller, propertyKey);

        this.singleton = <T extends ClassConstructor>(
            constructor: T,
            options?: AutowiredOptions
        ) => this.makeResolve(constructor, { ...options, lifeTime: AutowiredLifetimes.SINGLETON });

        this.instance = <T extends ClassConstructor>(
            constructor: T,
            options?: AutowiredOptions
        ) => this.makeResolve(constructor, { ...options, lifeTime: AutowiredLifetimes.PER_INSTANCE });

        this.override = (
            from: ClassConstructor,
            to: ClassConstructor,
            options?: AutowiredOptions
        ) => this.makeOverride(from, to, options);
    }

    protected makeAutowired(options?: AutowiredOptions): PropertyDecorator {
        return (target: object, propertyKey: string | symbol): void => {
            const type: ClassConstructor = (Reflect as any).getMetadata("design:type", target, propertyKey) as ClassConstructor;
            const { resolve } = this;

            Reflect.defineProperty(
                target,
                propertyKey,
                {
                    configurable: false,
                    enumerable: false,
                    get() {
                        return resolve(type, options, this, propertyKey);
                    }
                }
            );
        };
    }

    protected makeResolve<T extends ClassConstructor>(
        inConstructor: T,
        inOptions?: AutowiredOptions,
        caller?: object,
        propertyKey?: string | symbol
    ): T {
        let constructor = inConstructor;
        let options = inOptions;

        if (this.overrideList.has(constructor)) {
            const overridOptions = this.overrideList.get(constructor) as OverrideOptions;
            constructor = overridOptions.to as T;
            options = overridOptions.options ?? options;
        }

        const lifeTime = options?.lifeTime ?? AutowiredLifetimes.SINGLETON;
        if (lifeTime === AutowiredLifetimes.SINGLETON) {
            if (this.singletonsList.has(constructor)) {
                return this.singletonsList.get(constructor) as T;
            }
        } else if (lifeTime === AutowiredLifetimes.PER_OWNED && propertyKey) {
            if (Reflect.has(constructor, this.getDiKey(propertyKey))) {
                return Reflect.get(constructor, this.getDiKey(propertyKey)) as T;
            }
        } else if (lifeTime === AutowiredLifetimes.PER_INSTANCE && caller && propertyKey) {
            if (Reflect.has(caller, this.getDiKey(propertyKey))) {
                return Reflect.get(caller, this.getDiKey(propertyKey)) as T;
            }
        }

        const params: ClassConstructor[] = (Reflect as any).getMetadata("design:paramtypes", constructor) as [] || [];

        const object = new (constructor as (new (...params: object[]) => object))(...params
            .map((paramConstructor: ClassConstructor) => this.makeResolve(paramConstructor, options))) as T;

        if (lifeTime === AutowiredLifetimes.SINGLETON) {
            this.singletonsList.set(constructor, object);
        } else if (lifeTime === AutowiredLifetimes.PER_OWNED) {
            Reflect.set(constructor, this.getDiKey(propertyKey), object);
        } else if (lifeTime === AutowiredLifetimes.PER_INSTANCE && caller) {
            Reflect.set(caller, this.getDiKey(propertyKey), object);
        }

        return object;
    }

    protected makeReset(): void {
        this.singletonsList = new Map<ClassConstructor, object>();
        this.overrideList = new Map<ClassConstructor, OverrideOptions>();
    }

    protected makeOverride(from: ClassConstructor, to: ClassConstructor, options?: AutowiredOptions): void {
        this.overrideList.set(from, { to, options });
    }

    protected getDiKey(propertyKey?: string | symbol): string {
        return `$_di_${String(propertyKey)}`; // think about symbol
    }

}
