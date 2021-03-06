/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable @typescript-eslint/ban-types */

export type ClassConstructor<T extends object> = (new (...params: any) => T); // Use ConstructorParameters<T>, but how???

export type OverrideConstructor<T extends object> = ClassConstructor<T> | (Function & {prototype: T});
