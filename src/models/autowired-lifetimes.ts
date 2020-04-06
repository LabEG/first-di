export const enum AutowiredLifetimes {

    /**
     * Create one instance for all resolvers
     */

    SINGLETON,

    /**
     * Create one instance for one resolver
     */

    PER_INSTANCE,

    /**
     * Create one instance for one type of resolver
     */
    PER_OWNED,

    /**
     * Recreate each dependency on each access to dependency
     */
    PER_ACCESS
}
