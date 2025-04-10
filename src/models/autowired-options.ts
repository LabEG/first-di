import type {AutowiredLifetimes} from "./autowired-lifetimes.js";

/*
 * Interface defining options for the @autowired decorator and dependency resolution.
 * Allows customization of dependency lifecycle and behavior.
 */
export interface AutowiredOptions {
    lifeTime: AutowiredLifetimes;
}
