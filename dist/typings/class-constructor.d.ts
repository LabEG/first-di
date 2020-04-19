export declare type ClassConstructor<T extends object> = (new (...params: object[]) => T);
export declare type OverrideConstructor<T extends object> = ClassConstructor<T> | (Function & {
    prototype: T;
});
