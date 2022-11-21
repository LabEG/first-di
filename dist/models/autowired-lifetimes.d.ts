export declare enum AutowiredLifetimes {
    /**
     * Create one instance for all resolvers
     */
    Singleton = 0,
    /**
     * Create one instance for each resolver
     */
    PerInstance = 1,
    /**
     * Create one instance for each type of resolver
     */
    PerOwned = 2,
    /**
     * Recreate each dependency on each access to dependency
     */
    PerAccess = 3
}
