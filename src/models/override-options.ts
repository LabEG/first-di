/* eslint-disable @typescript-eslint/ban-types */
import type {ClassConstructor} from "../typings/class-constructor.js";
import type {AutowiredOptions} from "./autowired-options.js";

export interface OverrideOptions {
    to: ClassConstructor<object>;
    options?: AutowiredOptions;
}
