import { AutowiredLifetimes } from "../models/autowired-lifetimes.js";
export class DI {
    constructor() {
        this.singletonsList = new Map();
        this.overrideList = new Map();
        this.autowired = (options) => this.makeAutowired(options);
        this.reset = () => {
            this.makeReset();
        };
        this.resolve = (constructor, options, caller, propertyKey) => this.makeResolve(constructor, options, caller, propertyKey);
        this.singleton = (constructor, options) => this.makeResolve(constructor, { ...options,
            lifeTime: AutowiredLifetimes.Singleton });
        this.instance = (constructor, options) => this.makeResolve(constructor, { ...options,
            lifeTime: AutowiredLifetimes.PerInstance });
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
    // eslint-disable-next-line max-statements
    makeResolve(inConstructor, inOptions, caller, propertyKey) {
        let constructor = inConstructor;
        let options = inOptions;
        if (this.overrideList.has(constructor)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const overrideOptions = this.overrideList.get(constructor);
            constructor = overrideOptions.to;
            options = overrideOptions.options ?? options;
        }
        const lifeTime = options?.lifeTime ?? AutowiredLifetimes.Singleton;
        if (lifeTime === AutowiredLifetimes.Singleton) {
            if (this.singletonsList.has(constructor)) {
                return this.singletonsList.get(constructor);
            }
        }
        else if (lifeTime === AutowiredLifetimes.PerOwned && Boolean(propertyKey)) {
            if (Reflect.has(constructor, this.getDiKey(propertyKey))) {
                return Reflect.get(constructor, this.getDiKey(propertyKey));
            }
        }
        else if (lifeTime === AutowiredLifetimes.PerInstance && caller && Boolean(propertyKey)) {
            if (Reflect.has(caller, this.getDiKey(propertyKey))) {
                return Reflect.get(caller, this.getDiKey(propertyKey));
            }
        }
        const params = Reflect
            .getMetadata("design:paramtypes", constructor) ?? [];
        const object = new constructor(...params
            .map((paramConstructor) => this.makeResolve(paramConstructor, options)));
        if (lifeTime === AutowiredLifetimes.Singleton) {
            this.singletonsList.set(constructor, object);
        }
        else if (lifeTime === AutowiredLifetimes.PerOwned) {
            Reflect.set(constructor, this.getDiKey(propertyKey), object);
        }
        else if (lifeTime === AutowiredLifetimes.PerInstance && caller) {
            Reflect.set(caller, this.getDiKey(propertyKey), object);
        }
        return object;
    }
    makeReset() {
        this.singletonsList = new Map();
        this.overrideList = new Map();
    }
    makeOverride(from, to, options) {
        this.overrideList.set(from, {
            to,
            options
        });
    }
    getDiKey(propertyKey) {
        return `$_di_${String(propertyKey)}`; // Think about symbol
    }
}
DI.defaultOptions = {
    lifeTime: AutowiredLifetimes.Singleton
};
