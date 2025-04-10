First DI
=====

Easy dependency injection for TypeScript applications

Installation
------

For the latest stable version:

```Bash
npm i first-di
```

Features
------

- Easy and powerful dependency injection for any TypeScript application.
- 2 modes of work. Optional DI - for most apps. Classic DI - for advanced apps.
- Support for multiple scopes.
- Supports multiple life cycles.
- Dependency-free. Dependencies are used only for development.

Setup
------

Install [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) package and import it in the root TypeScript file. This package is needed to support reflection and is a mandatory requirement of TypeScript.

In tsconfig.json enable compiler options:

```Json
{
    "compilerOptions": {
        ...
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        ...
    }
}

```

Using in Optional DI mode
------

Just write classes and inject dependencies through class constructors. When the 'resolve' function is called, all dependencies will be resolved.

```typescript
import { resolve, override, reflection } from "first-di";

@reflection // TypeScript will generate reflection metadata
class ProdRepository { // Default implementation

    public async getData (): Promise<string> {
        return Promise.resolve("production");
    }

}

@reflection
class MockRepository implements ProdRepository { // Mock implementation with same interface

    public async getData (): Promise<string> {
        return Promise.resolve("mock");
    }

}

@reflection
class ProdService {

    public constructor (
        private readonly prodRepository: ProdRepository
    ) { }

    public async getData (): Promise<string> {
        return this.prodRepository.getData();
    }

}

@reflection
class ProdStore {

    public constructor (
        // Inject dependency
        private readonly prodService: ProdService
    ) {
        // Other logic here
    }

    public async getData (): Promise<string> {
        return this.prodService.getData();
    }

}

if (process.env.NODE_ENV === "test") { // Override in test environment
    override(ProdRepository, MockRepository);
}

const store = resolve(ProdStore); // Create instance by framework
const data = await store.getData();

if (process.env.NODE_ENV === "test") {
    assert.strictEqual(data, "mock");
} else {
    assert.strictEqual(data, "production");
}
```

Using in Classic DI mode
------

 In professional mode Abstract classes are used instead of interfaces. TypeScript does not generate interfaces for working in runtime. Abstract classes serve as the abstract base class. So instead of interfaces, you need to write Abstract classes.

```typescript
import { resolve, override, reflection } from "first-di";

abstract class AbstractRepository { // Abstract instead of interface

    public abstract getData (): Promise<string>;

}

@reflection
class ProdRepository implements AbstractRepository {

    public async getData (): Promise<string> {
        return Promise.resolve("production");
    }

}

@reflection
class MockRepository implements AbstractRepository {

    public async getData (): Promise<string> {
        return Promise.resolve("mock");
    }

}

abstract class AbstractService { // Abstract instead of interface

    public abstract getData (): Promise<string>;

}

@reflection
class ProdService implements AbstractService {

    private readonly prodRepository: AbstractRepository;

    public constructor (prodRepository: AbstractRepository) {
        this.prodRepository = prodRepository;
    }

    public async getData (): Promise<string> {
        return this.prodRepository.getData();
    }

}

@reflection
class ProdStore {

    public constructor (
        private readonly prodService: AbstractService
    ) {}

    public async getData (): Promise<string> {
        return this.prodService.getData();
    }

}

override(AbstractService, ProdService);

if (process.env.NODE_ENV === "test") {
    override(AbstractRepository, MockRepository);
} else {
    override(AbstractRepository, ProdRepository);
}

const store = resolve(ProdStore);
const data = await store.getData();

if (process.env.NODE_ENV === "test") {
    assert.strictEqual(data, "mock");
} else {
    assert.strictEqual(data, "production");
}
```

Options
------

First DI has several points for customizing dependency options:

- **Global** - `DI.defaultOptions: AutowiredOptions`. Sets global default behavior.
- **Override** - `override(fromClass, toClass, options?: AutowiredOptions)`. Sets behavior overridden dependency.
- **Resolve** - `resolve(class, options?: AutowiredOptions)`. Sets behaviors for resolve dependencies.

Options have the following properties:

- **lifeTime: AutowiredLifetimes** - Sets lifeTime of dependency.

    SINGLETON - Create one instance for all resolvers.

    PER_INSTANCE - Create one instance for one resolver instance. Also called ‘transient’ or ‘factory’ in other containers.

    PER_OWNED - Create one instance for one type of resolver.

    PER_ACCESS - Create new instance on each access to resolved property.

Scopes
------

Support multiple scopes

```typescript
import { DI } from "first-di";
import { ProductionService } from "../services/ProductionService";

const scopeA = new DI();
const scopeB = new DI();

const serviceScopeA = scopeA.resolve(ProductionService);
const dataA = await serviceScopeA.getData();

const serviceScopeB = scopeB.resolve(ProductionService);
const dataB = await serviceScopeB.getData();
```

API
------

First DI also has an API for extended use.

- override - Function. Override dependency and resolve options.
- resolve - Function. Resolves dependency with default options or specified.
- singleton - Function. Resolve singleton.
- instance - Function. Resolve new instance.
- reset - Function. Reset all singleton list and override list, but doesn't reset global options.

Resolve, singleton, instance - can be used to implement the Service Locator.

```typescript
import { singleton, instance, resolve, AutowiredLifetimes } from "first-di";

class ApiDemo {

    private readonly service3: ApiService3 = resolve(ApiService3, { lifeTime: AutowiredLifetimes.PER_INSTANCE });

    private readonly service4: ApiService4 = singleton(ApiService4);

    private readonly service5: ApiService5 = instance(ApiService5);

}
```

Extension DI
------

First DI uses OOP and SOLID design principles. Each part of DI can be overridden or extended after inheritance from the base class.

```typescript
import { DI } from "first-di";

class MyDI extends DI {
    // extended method
    public getAllSingletons(): IterableIterator<object> {
        return this.singletonsList.values();
    }
}
```
