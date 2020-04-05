/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { AutowiredOptions } from "../models/autowired-options";
import { ClassConstructor } from "../typings/class-constructor";
import { AutowiredLifetimes } from "../models/autowired-lifetimes";

export class DI {

    public autowired: (options?: AutowiredOptions) => PropertyDecorator;

    private singletonsList: Map<new () => object, object> = new Map<new () => object, object>();

    constructor() {
        this.autowired = (options?: AutowiredOptions) => this.makeAutowired(options);
    }

    public singleton(constructor: ClassConstructor, params: ClassConstructor[]): object {
        if (this.singletonsList.has(constructor)) {
            return this.singletonsList.get(constructor) as object;
        }
        const object = new constructor(...params.map((paramConstructor: ClassConstructor) => this.singleton(
            paramConstructor,
            (Reflect as any).getMetadata("design:paramtypes", paramConstructor) || []
        )));
        this.singletonsList.set(constructor, object);

        return object;
    }

    public reset(): void {
        this.singletonsList = new Map<new () => object, object>();
    }

    private makeAutowired(options?: AutowiredOptions): PropertyDecorator {
        return (target: object, propertyKey: string | symbol): void => {
            const type: ClassConstructor = (Reflect as any).getMetadata("design:type", target, propertyKey);
            const paramTypes: ClassConstructor[] = (Reflect as any).getMetadata("design:paramtypes", type) || [];

            const lifetTime = options?.lifeTime ?? AutowiredLifetimes.SINGLETON;
            if (lifetTime === AutowiredLifetimes.SINGLETON) {
                Object.defineProperty(
                    target,
                    propertyKey,
                    {
                        configurable: false,
                        enumerable: false,
                        value: this.singleton(type, paramTypes),
                        writable: false
                    }
                );
            } else {
                throw new Error("Not implemented yet.");
            }
        };
    }

}

export const { autowired, singleton, reset } = new DI(); // export as singleton
