export declare const enum AutowiredLifetimes {
    /**
     * Create one instance for all resolvers
     */
    SINGLETON = 0,
    /**
     * Create one instance for each resolver
     */
    PER_INSTANCE = 1,
    /**
     * Create one instance for each type of resolver
     */
    PER_OWNED = 2,
    /**
     * Recreate each dependency on each access to dependency
     */
    PER_ACCESS = 3
}
