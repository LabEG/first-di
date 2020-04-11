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
    public resolve: (constructor: ClassConstructor, options?: AutowiredOptions) => object;
    public override: (from: ClassConstructor, to: ClassConstructor, options?: AutowiredOptions) => void;

    private singletonsList: Map<ClassConstructor, object> = new Map<ClassConstructor, object>();
    private overrideList: Map<ClassConstructor, OverrideOptions> = new Map<ClassConstructor, OverrideOptions>();

    constructor() {
        this.autowired = (options?: AutowiredOptions) => this.makeAutowired(options);
        this.reset = () => this.makeReset();
        this.resolve = (constructor: ClassConstructor) => this.makeResolve(constructor);
        this.override = (
            from: ClassConstructor,
            to: ClassConstructor,
            options?: AutowiredOptions
        ) => this.makeOverride(from, to, options);
    }

    private makeAutowired(options?: AutowiredOptions): PropertyDecorator {
        return (target: object, propertyKey: string | symbol): void => {
            const type: ClassConstructor = (Reflect as any).getMetadata("design:type", target, propertyKey);

            Object.defineProperty(
                target,
                propertyKey,
                {
                    configurable: false,
                    enumerable: false,
                    get: () => this.resolve(type, options)
                }
            );
        };
    }

    private makeResolve(inConstructor: ClassConstructor, inOptions?: AutowiredOptions): object {
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
        }

        const params: ClassConstructor[] = (Reflect as any).getMetadata("design:paramtypes", constructor) || [];

        const object = new (constructor as (new (...params: object[]) => object))(...params
            .map((paramConstructor: ClassConstructor) => this.makeResolve(paramConstructor, options)));

        if (lifeTime === AutowiredLifetimes.SINGLETON) {
            this.singletonsList.set(constructor, object);
        }

        return object;
    }

    private makeReset(): void {
        this.singletonsList = new Map<ClassConstructor, object>();
        this.overrideList = new Map<ClassConstructor, OverrideOptions>();
    }

    private makeOverride(from: ClassConstructor, to: ClassConstructor, options?: AutowiredOptions): void {
        this.overrideList.set(from, { to, options });
    }

}
