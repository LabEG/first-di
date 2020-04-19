
// eslint-disable-next-line @typescript-eslint/no-type-alias, @typescript-eslint/no-explicit-any
export type ClassConstructor<T extends object> = (new (...params: any) => T); // use ConstructorParameters<T>, but how???

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type OverrideConstructor<T extends object> = ClassConstructor<T> | (Function & { prototype: T });
