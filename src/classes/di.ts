/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { AutowiredOptions } from "../models/autowired-options";
import { ClassConstructor } from "../typings/class-constructor";
import { AutowiredLifetimes } from "../models/autowired-lifetimes";

export class DI {

    public static defaultLifetime: AutowiredLifetimes = AutowiredLifetimes.SINGLETON;

    public autowired: (options?: AutowiredOptions) => PropertyDecorator;
    public reset: () => void;
    public singleton: (constructor: ClassConstructor) => object;
    public instance: (constructor: ClassConstructor) => object;
    public override: (from: ClassConstructor, to: ClassConstructor, options?: AutowiredOptions) => void;

    private singletonsList: Map<ClassConstructor, object> = new Map<ClassConstructor, object>();

    constructor() {
        this.autowired = (options?: AutowiredOptions) => this.makeAutowired(options);
        this.reset = () => this.makeReset();
        this.singleton = (constructor: ClassConstructor) => this.makeSingleton(constructor);
        this.instance = (constructor: ClassConstructor) => this.makeInstance(constructor);
        this.override = (
            from: ClassConstructor,
            to: ClassConstructor,
            options?: AutowiredOptions
        ) => this.makeOverride(from, to, options);
    }

    private makeAutowired(options?: AutowiredOptions): PropertyDecorator {
        return (target: object, propertyKey: string | symbol): void => {
            const type: ClassConstructor = (Reflect as any).getMetadata("design:type", target, propertyKey);

            const lifetTime = options?.lifeTime ?? DI.defaultLifetime;
            if (lifetTime === AutowiredLifetimes.SINGLETON) {
                Object.defineProperty(
                    target,
                    propertyKey,
                    {
                        configurable: false,
                        enumerable: false,
                        get: () => this.singleton(type)
                    }
                );
            } else if (lifetTime === AutowiredLifetimes.PER_INSTANCE) {
                Object.defineProperty(
                    target,
                    propertyKey,
                    {
                        configurable: false,
                        enumerable: false,
                        get: () => this.instance(type)
                    }
                );
            } else if (lifetTime === AutowiredLifetimes.PER_OWNED) {
                const instance = this.instance(type);
                Object.defineProperty(
                    target,
                    propertyKey,
                    {
                        configurable: false,
                        enumerable: false,
                        get: () => instance
                    }
                );
            } else if (lifetTime === AutowiredLifetimes.PER_ACCESS) {
                Object.defineProperty(
                    target,
                    propertyKey,
                    {
                        configurable: false,
                        enumerable: false,
                        get: () => this.instance(type)
                    }
                );
            } else {
                throw new Error("Not implemented yet.");
            }
        };
    }

    private makeSingleton(constructor: ClassConstructor): object {
        if (this.singletonsList.has(constructor)) {
            return this.singletonsList.get(constructor) as object;
        }
        const params: ClassConstructor[] = (Reflect as any).getMetadata("design:paramtypes", constructor) || [];
        const object = new constructor(...params.map((paramConstructor: ClassConstructor) => this.singleton(paramConstructor)));
        this.singletonsList.set(constructor, object);

        return object;
    }

    private makeInstance(constructor: ClassConstructor): object {
        const params: ClassConstructor[] = (Reflect as any).getMetadata("design:paramtypes", constructor) || [];
        const object = new constructor(...params.map((paramConstructor: ClassConstructor) => this.instance(paramConstructor)));

        return object;
    }

    private makeReset(): void {
        this.singletonsList = new Map<ClassConstructor, object>();
    }

    private makeOverride(_from: ClassConstructor, _to: ClassConstructor, _options?: AutowiredOptions): void {
        // write code
    }

}
