"use strict";
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable max-statements */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DI = void 0;
const autowired_lifetimes_1 = require("../models/autowired-lifetimes");
class DI {
    constructor() {
        this.singletonsList = new Map();
        this.overrideList = new Map();
        this.autowired = (options) => this.makeAutowired(options);
        this.reset = () => {
            this.makeReset();
        };
        this.resolve = (constructor, options, caller, propertyKey) => this.makeResolve(constructor, options, caller, propertyKey);
        this.singleton = (constructor, options) => this.makeResolve(constructor, Object.assign(Object.assign({}, options), { lifeTime: autowired_lifetimes_1.AutowiredLifetimes.Singleton }));
        this.instance = (constructor, options) => this.makeResolve(constructor, Object.assign(Object.assign({}, options), { lifeTime: autowired_lifetimes_1.AutowiredLifetimes.PerInstance }));
        this.override = (from, to, options) => {
            this.makeOverride(from, to, options);
        };
    }
    makeAutowired(options) {
        return (target, propertyKey) => {
            const type = Reflect.getMetadata("design:type", target, propertyKey);
            const { resolve } = this;
            Reflect.defineProperty(target, propertyKey, {
                configurable: false,
                enumerable: false,
                get() {
                    return resolve(type, options, this, propertyKey);
                }
            });
        };
    }
    makeResolve(inConstructor, inOptions, caller, propertyKey) {
        var _a, _b;
        let constructor = inConstructor;
        let options = inOptions;
        if (this.overrideList.has(constructor)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const overridOptions = this.overrideList.get(constructor);
            constructor = overridOptions.to;
            options = (_a = overridOptions.options) !== null && _a !== void 0 ? _a : options;
        }
        const lifeTime = (_b = options === null || options === void 0 ? void 0 : options.lifeTime) !== null && _b !== void 0 ? _b : autowired_lifetimes_1.AutowiredLifetimes.Singleton;
        if (lifeTime === autowired_lifetimes_1.AutowiredLifetimes.Singleton) {
            if (this.singletonsList.has(constructor)) {
                return this.singletonsList.get(constructor);
            }
        }
        else if (lifeTime === autowired_lifetimes_1.AutowiredLifetimes.PerOwned && propertyKey) {
            if (Reflect.has(constructor, this.getDiKey(propertyKey))) {
                return Reflect.get(constructor, this.getDiKey(propertyKey));
            }
        }
        else if (lifeTime === autowired_lifetimes_1.AutowiredLifetimes.PerInstance && caller && propertyKey) {
            if (Reflect.has(caller, this.getDiKey(propertyKey))) {
                return Reflect.get(caller, this.getDiKey(propertyKey));
            }
        }
        const params = Reflect.getMetadata("design:paramtypes", constructor) || [];
        const object = new constructor(...params
            .map((paramConstructor) => this.makeResolve(paramConstructor, options)));
        if (lifeTime === autowired_lifetimes_1.AutowiredLifetimes.Singleton) {
            this.singletonsList.set(constructor, object);
        }
        else if (lifeTime === autowired_lifetimes_1.AutowiredLifetimes.PerOwned) {
            Reflect.set(constructor, this.getDiKey(propertyKey), object);
        }
        else if (lifeTime === autowired_lifetimes_1.AutowiredLifetimes.PerInstance && caller) {
            Reflect.set(caller, this.getDiKey(propertyKey), object);
        }
        return object;
    }
    makeReset() {
        this.singletonsList = new Map();
        this.overrideList = new Map();
    }
    makeOverride(from, to, options) {
        this.overrideList.set(from, { to,
            options });
    }
    getDiKey(propertyKey) {
        return `$_di_${String(propertyKey)}`; // Think about symbol
    }
}
exports.DI = DI;
DI.defaultOptions = {
    lifeTime: autowired_lifetimes_1.AutowiredLifetimes.Singleton
};
