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
    public singleton: (constructor: ClassConstructor) => object;
    public instance: (constructor: ClassConstructor) => object;
    public override: (from: ClassConstructor, to: ClassConstructor, options?: AutowiredOptions) => void;

    private singletonsList: Map<ClassConstructor, object> = new Map<ClassConstructor, object>();
    private overrideList: Map<ClassConstructor, OverrideOptions> = new Map<ClassConstructor, OverrideOptions>();

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

            const lifetTime = options?.lifeTime ?? DI.defaultOptions.lifeTime;
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
                const instanceMaker = this.instance;
                Object.defineProperty(
                    target,
                    propertyKey,
                    {
                        configurable: false,
                        enumerable: false,
                        // eslint-disable-next-line func-names
                        get(): object {
                            if (!Reflect.has(this, `$_${String(propertyKey)}`)) {
                                Reflect.set(this, `$_${String(propertyKey)}`, instanceMaker(type));
                            }

                            return Reflect.get(this, `$_${String(propertyKey)}`) as object;
                        }
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
        const object = new constructor(...params.map((paramConstructor: ClassConstructor) => {
            if (this.overrideList.has(paramConstructor)) {
                return this.singleton(this.overrideList.get(paramConstructor)?.to as ClassConstructor);
            }
            return this.singleton(paramConstructor);
        }));
        this.singletonsList.set(constructor, object);

        return object;
    }

    private makeInstance(constructor: ClassConstructor): object {
        const params: ClassConstructor[] = (Reflect as any).getMetadata("design:paramtypes", constructor) || [];
        const object = new constructor(...params.map((paramConstructor: ClassConstructor) => {
            if (this.overrideList.has(paramConstructor)) {
                return this.instance(this.overrideList.get(paramConstructor)?.to as ClassConstructor);
            }
            return this.instance(paramConstructor);
        }));

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
