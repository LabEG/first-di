import type {ClassConstructor} from "../typings/class-constructor.js";
import type {AutowiredOptions} from "./autowired-options.js";

/*
 * Interface defining options for overriding dependencies in the DI container.
 * Specifies the target class and optional configuration.
 */
export interface OverrideOptions {
    to: ClassConstructor<object>;
    options?: AutowiredOptions;
}
