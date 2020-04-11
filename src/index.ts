export * from "./classes/di";
export * from "./decorators/reflection";

import { DI } from "./classes/di";
export const {
    autowired,
    override,
    singleton,
    reset
} = new DI(); // export as singleton
