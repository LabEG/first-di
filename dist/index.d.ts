export * from "./classes/di";
export * from "./decorators/reflection";
export declare const autowired: (options?: import("./models/autowired-options").AutowiredOptions | undefined) => PropertyDecorator, override: (from: import("./typings/class-constructor").ClassConstructor, to: import("./typings/class-constructor").ClassConstructor, options?: import("./models/autowired-options").AutowiredOptions | undefined) => void, reset: () => void;
