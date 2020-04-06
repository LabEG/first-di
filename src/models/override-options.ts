import { ClassConstructor } from "../typings/class-constructor";
import { AutowiredOptions } from "./autowired-options";

export interface OverrideOptions {
    to: ClassConstructor;
    options?: AutowiredOptions;
}
