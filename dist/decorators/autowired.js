"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable func-style */
Object.defineProperty(exports, "__esModule", { value: true });
var Singleton_1 = require("../functions/Singleton");
function autowired(target, propertyKey) {
    var type = Reflect.getMetadata("design:type", target, propertyKey);
    var paramTypes = Reflect.getMetadata("design:paramtypes", type) || [];
    Object.defineProperty(target, propertyKey, {
        configurable: false,
        enumerable: false,
        value: Singleton_1.singleton(type, paramTypes),
        writable: false
    });
}
exports.autowired = autowired;
