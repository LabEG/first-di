export type ClassConstructor<T extends object> = (new (...params: any[]) => T);
export type OverrideConstructor<T extends object> = ClassConstructor<T> | (Function & {
    prototype: T;
});
