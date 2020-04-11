export * from "./classes/di";
export * from "./decorators/reflection";

import { DI } from "./classes/di";
export const {
    autowired,
    override,
    reset
} = new DI(); // export as singleton
