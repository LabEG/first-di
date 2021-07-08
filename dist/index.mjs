export * from "./classes/di";
export * from "./decorators/reflection";
export * from "./models/autowired-lifetimes";
import { DI } from "./classes/di";
export const { autowired, override, resolve, singleton, instance, reset } = new DI(); // Export as singleton
