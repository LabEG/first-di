export * from "./classes/di";

import { DI } from "./classes/di";
export const {
    autowired,
    override,
    singleton,
    reset
} = new DI(); // export as singleton
