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
    public resolve: (
        constructor: ClassConstructor,
        options?: AutowiredOptions,
        caller?: object,
        propertyKey?: string | symbol
    ) => object;
    public override: (from: ClassConstructor, to: ClassConstructor, options?: AutowiredOptions) => void;

    protected singletonsList: Map<ClassConstructor, object> = new Map<ClassConstructor, object>();
    protected overrideList: Map<ClassConstructor, OverrideOptions> = new Map<ClassConstructor, OverrideOptions>();

    constructor() {
        this.autowired = (options?: AutowiredOptions) => this.makeAutowired(options);
        this.reset = () => this.makeReset();
        this.resolve = (
            constructor: ClassConstructor,
            options?: AutowiredOptions,
            caller?: object,
            propertyKey?: string | symbol
        ) => this.makeResolve(constructor, options, caller, propertyKey);
        this.override = (
            from: ClassConstructor,
            to: ClassConstructor,
            options?: AutowiredOptions
        ) => this.makeOverride(from, to, options);
    }

    protected makeAutowired(options?: AutowiredOptions): PropertyDecorator {
        return (target: object, propertyKey: string | symbol): void => {
            const type: ClassConstructor = (Reflect as any).getMetadata("design:type", target, propertyKey);
            const { resolve } = this;

            Object.defineProperty(
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

    protected makeResolve(
        inConstructor: ClassConstructor,
        inOptions?: AutowiredOptions,
        caller?: object,
        propertyKey?: string | symbol
    ): object {
        let constructor = inConstructor;
        let options = inOptions;

        if (this.overrideList.has(constructor)) {
            const overridOptions = this.overrideList.get(constructor) as OverrideOptions;
            constructor = overridOptions.to;
            options = overridOptions.options ?? options;
        }

        const lifeTime = options?.lifeTime ?? AutowiredLifetimes.SINGLETON;
        if (lifeTime === AutowiredLifetimes.SINGLETON) {
            if (this.singletonsList.has(constructor)) {
                return this.singletonsList.get(constructor) as object;
            }
        } else if (lifeTime === AutowiredLifetimes.PER_OWNED && propertyKey) {
            if (Reflect.has(constructor, this.getDiKey(propertyKey))) {
                return Reflect.get(constructor, this.getDiKey(propertyKey)) as object;
            }
        } else if (lifeTime === AutowiredLifetimes.PER_INSTANCE && caller && propertyKey) {
            if (Reflect.has(caller, this.getDiKey(propertyKey))) {
                return Reflect.get(caller, this.getDiKey(propertyKey)) as object;
            }
        }

        const params: ClassConstructor[] = (Reflect as any).getMetadata("design:paramtypes", constructor) || [];

        const object = new (constructor as (new (...params: object[]) => object))(...params
            .map((paramConstructor: ClassConstructor) => this.makeResolve(paramConstructor, options)));

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
