/* eslint-disable @typescript-eslint/ban-types */
import type {ClassConstructor} from "../typings/class-constructor";
import type {AutowiredOptions} from "./autowired-options";

export interface OverrideOptions {
    to: ClassConstructor<object>;
    options?: AutowiredOptions;
}
