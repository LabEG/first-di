/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { singleton } from "../functions/Singleton";

export const autowired = (target: object, propertyKey: string | symbol): void => {
    const type: ClassConstructor = (Reflect as any).getMetadata("design:type", target, propertyKey);
    const paramTypes: ClassConstructor[] = (Reflect as any).getMetadata("design:paramtypes", type) || [];

    Object.defineProperty(
        target,
        propertyKey,
        {
            configurable: false,
            enumerable: false,
            value: singleton(type, paramTypes),
            writable: false
        }
    );
};
