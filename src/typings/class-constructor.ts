
// eslint-disable-next-line @typescript-eslint/no-type-alias
export type ClassConstructor = (new (...params: object[]) => object) | Function & { prototype: object };
