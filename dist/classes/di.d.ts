import { AutowiredOptions } from "../models/autowired-options";
import { ClassConstructor, OverrideConstructor } from "../typings/class-constructor";
import { OverrideOptions } from "../models/override-options";
export declare class DI {
    static defaultOptions: AutowiredOptions;
    autowired: (options?: AutowiredOptions) => PropertyDecorator;
    reset: () => void;
    resolve: <T extends object>(constructor: ClassConstructor<T>, options?: AutowiredOptions, caller?: object, propertyKey?: string | symbol) => T;
    singleton: <T extends object>(constructor: ClassConstructor<T>, options?: AutowiredOptions) => T;
    instance: <T extends object>(constructor: ClassConstructor<T>, options?: AutowiredOptions) => T;
    override: <T extends object>(from: OverrideConstructor<T>, to: ClassConstructor<object>, options?: AutowiredOptions) => void;
    protected singletonsList: Map<ClassConstructor<object>, object>;
    protected overrideList: Map<OverrideConstructor<object>, OverrideOptions>;
    constructor();
    protected makeAutowired(options?: AutowiredOptions): PropertyDecorator;
    protected makeResolve<T extends object>(inConstructor: ClassConstructor<T>, inOptions?: AutowiredOptions, caller?: object, propertyKey?: string | symbol): T;
    protected makeReset(): void;
    protected makeOverride<T extends object>(from: OverrideConstructor<T>, to: ClassConstructor<T>, options?: AutowiredOptions): void;
    protected getDiKey(propertyKey?: string | symbol): string;
}
