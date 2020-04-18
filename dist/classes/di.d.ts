import { AutowiredOptions } from "../models/autowired-options";
import { ClassConstructor } from "../typings/class-constructor";
import { OverrideOptions } from "../models/override-options";
export declare class DI {
    static defaultOptions: AutowiredOptions;
    autowired: (options?: AutowiredOptions) => PropertyDecorator;
    reset: () => void;
    resolve: (constructor: ClassConstructor, options?: AutowiredOptions, caller?: object, propertyKey?: string | symbol) => object;
    override: (from: ClassConstructor, to: ClassConstructor, options?: AutowiredOptions) => void;
    protected singletonsList: Map<ClassConstructor, object>;
    protected overrideList: Map<ClassConstructor, OverrideOptions>;
    constructor();
    protected makeAutowired(options?: AutowiredOptions): PropertyDecorator;
    protected makeResolve(inConstructor: ClassConstructor, inOptions?: AutowiredOptions, caller?: object, propertyKey?: string | symbol): object;
    protected makeReset(): void;
    protected makeOverride(from: ClassConstructor, to: ClassConstructor, options?: AutowiredOptions): void;
    protected getDiKey(propertyKey?: string | symbol): string;
}
