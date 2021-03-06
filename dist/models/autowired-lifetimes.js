"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutowiredLifetimes = void 0;
var AutowiredLifetimes;
(function (AutowiredLifetimes) {
    /**
     * Create one instance for all resolvers
     */
    AutowiredLifetimes[AutowiredLifetimes["Singleton"] = 0] = "Singleton";
    /**
     * Create one instance for each resolver
     */
    AutowiredLifetimes[AutowiredLifetimes["PerInstance"] = 1] = "PerInstance";
    /**
     * Create one instance for each type of resolver
     */
    AutowiredLifetimes[AutowiredLifetimes["PerOwned"] = 2] = "PerOwned";
    /**
     * Recreate each dependency on each access to dependency
     */
    AutowiredLifetimes[AutowiredLifetimes["PerAccess"] = 3] = "PerAccess";
})(AutowiredLifetimes = exports.AutowiredLifetimes || (exports.AutowiredLifetimes = {}));
