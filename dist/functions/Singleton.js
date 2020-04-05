"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var singletonsList = new Map();
function singleton(constructor, params) {
    if (singletonsList.has(constructor)) {
        return singletonsList.get(constructor);
    }
    var object = new (constructor.bind.apply(constructor, __spreadArrays([void 0], params.map(function (paramConstructor) { return singleton(paramConstructor, Reflect.getMetadata("design:paramtypes", paramConstructor) || []); }))))();
    singletonsList.set(constructor, object);
    return object;
}
exports.singleton = singleton;
