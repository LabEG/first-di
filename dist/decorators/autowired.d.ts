import { AutowiredOptions } from "../models/autowired-options";
import { ClassConstructor } from "../typings/class-constructor";
export declare class DI {
    autowired: (options?: AutowiredOptions) => PropertyDecorator;
    private singletonsList;
    constructor();
    singleton(constructor: ClassConstructor, params: ClassConstructor[]): object;
    reset(): void;
    private makeAutowired;
}
export declare const autowired: (options?: AutowiredOptions | undefined) => PropertyDecorator, singleton: (constructor: ClassConstructor, params: ClassConstructor[]) => object, reset: () => void;
