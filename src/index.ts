export * from "./classes/di";
export * from "./decorators/reflection";
export * from "./models/autowired-lifetimes";

import { DI } from "./classes/di";
export const {
    autowired,
    override,
    reset
} = new DI(); // export as singleton
