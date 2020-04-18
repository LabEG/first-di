/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
export class DI {
    constructor() {
        this.singletonsList = new Map();
        this.overrideList = new Map();
        this.autowired = (options) => this.makeAutowired(options);
        this.reset = () => this.makeReset();
        this.resolve = (constructor, options, caller, propertyKey) => this.makeResolve(constructor, options, caller, propertyKey);
        this.singleton = (constructor, options) => this.makeResolve(constructor, Object.assign(Object.assign({}, options), { lifeTime: 0 /* SINGLETON */ }));
        this.instance = (constructor, options) => this.makeResolve(constructor, Object.assign(Object.assign({}, options), { lifeTime: 1 /* PER_INSTANCE */ }));
        this.override = (from, to, options) => this.makeOverride(from, to, options);
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
            const overridOptions = this.overrideList.get(constructor);
            constructor = overridOptions.to;
            options = (_a = overridOptions.options) !== null && _a !== void 0 ? _a : options;
        }
        const lifeTime = (_b = options === null || options === void 0 ? void 0 : options.lifeTime) !== null && _b !== void 0 ? _b : 0 /* SINGLETON */;
        if (lifeTime === 0 /* SINGLETON */) {
            if (this.singletonsList.has(constructor)) {
                return this.singletonsList.get(constructor);
            }
        }
        else if (lifeTime === 2 /* PER_OWNED */ && propertyKey) {
            if (Reflect.has(constructor, this.getDiKey(propertyKey))) {
                return Reflect.get(constructor, this.getDiKey(propertyKey));
            }
        }
        else if (lifeTime === 1 /* PER_INSTANCE */ && caller && propertyKey) {
            if (Reflect.has(caller, this.getDiKey(propertyKey))) {
                return Reflect.get(caller, this.getDiKey(propertyKey));
            }
        }
        const params = Reflect.getMetadata("design:paramtypes", constructor) || [];
        const object = new constructor(...params
            .map((paramConstructor) => this.makeResolve(paramConstructor, options)));
        if (lifeTime === 0 /* SINGLETON */) {
            this.singletonsList.set(constructor, object);
        }
        else if (lifeTime === 2 /* PER_OWNED */) {
            Reflect.set(constructor, this.getDiKey(propertyKey), object);
        }
        else if (lifeTime === 1 /* PER_INSTANCE */ && caller) {
            Reflect.set(caller, this.getDiKey(propertyKey), object);
        }
        return object;
    }
    makeReset() {
        this.singletonsList = new Map();
        this.overrideList = new Map();
    }
    makeOverride(from, to, options) {
        this.overrideList.set(from, { to, options });
    }
    getDiKey(propertyKey) {
        return `$_di_${String(propertyKey)}`; // think about symbol
    }
}
DI.defaultOptions = {
    lifeTime: 0 /* SINGLETON */
};
