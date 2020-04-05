"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var DI = /** @class */ (function () {
    function DI() {
        var _this = this;
        this.singletonsList = new Map();
        this.autowired = function (options) { return _this.makeAutowired(options); };
    }
    DI.prototype.singleton = function (constructor, params) {
        var _this = this;
        if (this.singletonsList.has(constructor)) {
            return this.singletonsList.get(constructor);
        }
        var object = new (constructor.bind.apply(constructor, __spreadArrays([void 0], params.map(function (paramConstructor) { return _this.singleton(paramConstructor, Reflect.getMetadata("design:paramtypes", paramConstructor) || []); }))))();
        this.singletonsList.set(constructor, object);
        return object;
    };
    DI.prototype.reset = function () {
        this.singletonsList = new Map();
    };
    DI.prototype.makeAutowired = function (options) {
        var _this = this;
        return function (target, propertyKey) {
            var _a;
            var type = Reflect.getMetadata("design:type", target, propertyKey);
            var paramTypes = Reflect.getMetadata("design:paramtypes", type) || [];
            var lifetTime = (_a = options === null || options === void 0 ? void 0 : options.lifeTime) !== null && _a !== void 0 ? _a : 0 /* SINGLETON */;
            if (lifetTime === 0 /* SINGLETON */) {
                Object.defineProperty(target, propertyKey, {
                    configurable: false,
                    enumerable: false,
                    value: _this.singleton(type, paramTypes),
                    writable: false
                });
            }
            else {
                throw new Error("Not implemented yet.");
            }
        };
    };
    return DI;
}());
exports.DI = DI;
exports.autowired = (_a = new DI(), _a.autowired), exports.singleton = _a.singleton, exports.reset = _a.reset; // export as singleton
