/*
 * Type definitions for class constructors and override constructors.
 * Used for defining and managing dependency injection targets.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassConstructor<T extends object> = (new (...params: any[]) => T); // Use ConstructorParameters<T>, but how???

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @stylistic/block-spacing
export type OverrideConstructor<T extends object> = ClassConstructor<T> | (Function & {prototype: T});
