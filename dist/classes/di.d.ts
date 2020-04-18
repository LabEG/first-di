import { AutowiredOptions } from "../models/autowired-options";
import { ClassConstructor } from "../typings/class-constructor";
import { OverrideOptions } from "../models/override-options";
export declare class DI {
    static defaultOptions: AutowiredOptions;
    autowired: (options?: AutowiredOptions) => PropertyDecorator;
    reset: () => void;
    resolve: <T extends ClassConstructor>(constructor: T, options?: AutowiredOptions, caller?: object, propertyKey?: string | symbol) => T;
    singleton: <T extends ClassConstructor>(constructor: T, options?: AutowiredOptions) => T;
    instance: <T extends ClassConstructor>(constructor: T, options?: AutowiredOptions) => T;
    override: (from: ClassConstructor, to: ClassConstructor, options?: AutowiredOptions) => void;
    protected singletonsList: Map<ClassConstructor, object>;
    protected overrideList: Map<ClassConstructor, OverrideOptions>;
    constructor();
    protected makeAutowired(options?: AutowiredOptions): PropertyDecorator;
    protected makeResolve<T extends ClassConstructor>(inConstructor: T, inOptions?: AutowiredOptions, caller?: object, propertyKey?: string | symbol): T;
    protected makeReset(): void;
    protected makeOverride(from: ClassConstructor, to: ClassConstructor, options?: AutowiredOptions): void;
    protected getDiKey(propertyKey?: string | symbol): string;
}
