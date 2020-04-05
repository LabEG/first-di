/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

const singletonsList: Map<new () => object, object> = new Map<new () => object, object>();

export const singleton = (constructor: ClassConstructor, params: ClassConstructor[]): object => {
    if (singletonsList.has(constructor)) {
        return singletonsList.get(constructor) as object;
    }
    const object = new constructor(...params.map((paramConstructor: ClassConstructor) => singleton(
        paramConstructor,
        (Reflect as any).getMetadata("design:paramtypes", paramConstructor) || []
    )));
    singletonsList.set(constructor, object);

    return object;
};
