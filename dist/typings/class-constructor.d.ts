export declare type ClassConstructor = (new (...params: object[]) => object) | (Function & {
    prototype: object;
});
