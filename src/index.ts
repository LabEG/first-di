export * from "./classes/di.js";
export * from "./decorators/reflection.js";
export * from "./models/autowired-lifetimes.js";

import {DI} from "./classes/di.js";
export const {
    autowired,
    override,
    resolve,
    singleton,
    instance,
    reset
} = new DI(); // Export as singleton
