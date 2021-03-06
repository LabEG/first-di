First DI
=====

Easy dependency injection for typescript applications

Description:
------
- For working this library needed Metadata Reflection API. If your platform (browser/nodejs) don't support it you must use polifyll. Example: [reflect-metadata](https://www.npmjs.com/package/reflect-metadata).
- For working reflection should be enabled the option emitDecoratorMetadata and experimentalDecorators in tsconfig file.
- For generate reflection by typescript need to create any decorator or use @reflection decorator from this library.
- Lazy Loading for resolve dependency. Each dependency will created only after request property with @autowired decorator.
- Dependency Free. Dependency used only for development.

Using in Easy mode:
------
 Simply write code as you used to and use @autowired() decorator to implement dependencies. And for override dependencies just use method override.

```typescript
import { autowired, override, reflection } from "first-di";

@reflection // typescript will generate reflection metadata
class ProdRepository { // default implementation

    public async getData(): Promise<string> {
        return await Promise.resolve("production");
    }

}

@reflection
class MockRepository { // mock implementation with same interface

    public async getData(): Promise<string> {
        return await Promise.resolve("mock");
    }

}

@reflection
class ProdService {

    constructor(private readonly prodRepository: ProdRepository) { }

    public async getData(): Promise<string> {
        return await this.prodRepository.getData();
    }

}

class ProdController {

    @autowired() // inject dependency
    private readonly prodService!: ProdService;

    // constructor use library, don't use him for inject

    public async getData(): Promise<string> {
        return await this.prodService.getData();
    }

}

if (process.env.NODE_ENV === "test") { // override in test environment
    override(ProdRepository, MockRepository);
}

const controllerInstance = new ProdController(); // create intance by framework
const data = await controllerInstance.getData();

if (process.env.NODE_ENV === "test") {
    assert.strictEqual(data, "mock");
} else {
    assert.strictEqual(data, "production");
}
```

Using in Pro mode:
------
 In professional mode Interfaces are used instead of implementations. But typescript does not generate Interfaces for working in runtime. But Interface is abstract base class. So instead of Interfaces, you need to write Abstract classes.

```typescript
import { autowired, override, reflection } from "first-di";

abstract class AbstractRepository { // abstract instead of interface

    abstract getData(): Promise<string>;

}

@reflection
class ProdRepository implements AbstractRepository {

    public async getData(): Promise<string> {
        return await Promise.resolve("production");
    }

}

@reflection
class MockRepository implements AbstractRepository {

    public async getData(): Promise<string> {
        return await Promise.resolve("mock");
    }

}

abstract class AbstractService { // abstract instead of interface

    abstract getData(): Promise<string>;

}

@reflection
class ProdService implements AbstractService {

    private readonly prodRepository: AbstractRepository;

    constructor(prodRepository: AbstractRepository) {
        this.prodRepository = prodRepository;
    }

    public async getData(): Promise<string> {
        return await this.prodRepository.getData();
    }

}

class ProdController {

    @autowired()
    private readonly prodService!: AbstractService;

    // constructor use library, don't use him for inject

    public async getData(): Promise<string> {
        return await this.prodService.getData();
    }

}

override(AbstractService, ProdService);

if (process.env.NODE_ENV === "test") {
    override(AbstractRepository, MockRepository);
} else {
    override(AbstractRepository, ProdRepository);
}

const controllerInstance = new ProdController();
const data = await controllerInstance.getData();

if (process.env.NODE_ENV === "test") {
    assert.strictEqual(data, "mock");
} else {
    assert.strictEqual(data, "production");
}
```

Options:
------
First DI has several points for customizing dependency options.
- **Global** - `DI.defaultOptions: AutowiredOptions`. Sets global default behavior.
- **Autowired** - `@autowired(options?: AutowiredOptions)`. Sets behaviors for resolve dependencies.
- **Override** - `override(fromClass, toClass, options?: AutowiredOptions)`. Sets behavior overrided dependency.

AutowiredOptions has next properties:
- **lifeTime: AutowiredLifetimes** - Sets lifeTime of dependecy.

    SINGLETON - Create one instance for all resolvers.

    PER_INSTANCE - Create one instance for one resolver instance. Also called ‘transient’ or ‘factory’ in other containers.

    PER_OWNED - Create one instance for one type of resolver.

    PER_ACCESS - Create new instance on each access to resolved property.

Scopes:
------
Support multiple scopes

```typescript
import { DI } from "first-di";
import { ProductionService } from "../services/ProductionService";

const scopeA = new DI();
const scopeB = new DI();

export class Controller {

    @scopeA.autowired()
    private readonly serviceScopeA!: ProductionService;

    @scopeB.autowired()
    private readonly serviceScopeB!: ProductionService;

    // constructor use library, don't use him for inject

    public async getDataScopeA(): Promise<string> {
        return await this.serviceScopeA.getData();
    }

    public async getDataScopeB(): Promise<string> {
        return await this.serviceScopeB.getData();
    }

}
```

API:
------
First DI also has an API for extended use. For example, use as A Service Locator.

- autowired - Decorator. Assigned to property for resolve dependency.
- override - Function. Override dependency and resolve options.
- resolve - Function. Resolves dependence with default options or specified.
- singleton - Function. Resolve singleton.
- instance - Function. Resolve new instance.
- reset - Function. Reset all singleton list and override list, but don.t reset global options.

Resolve, singleton, instance - can be used to implement the Service Locator.

```typescript
import { singleton, instance, resolve, autowired, AutowiredLifetimes } from "first-di";

class ApiDemo {

    @autowired({ lifeTime: AutowiredLifetimes.SINGLETON })
    private readonly service1!: ApiService1;

    @autowired({ lifeTime: AutowiredLifetimes.PER_INSTANCE })
    private readonly service2!: ApiService2;

    private readonly service3: ApiService3 = resolve(ApiService3, { lifeTime: AutowiredLifetimes.PER_INSTANCE });

    private readonly service4: ApiService4 = singleton(ApiService4);

    private readonly service5: ApiService5 = instance(ApiService5);

}
```


Extension DI:
------
First DI using OOP and SOLID design principles. Each part of DI can be overrided or extended after inheritance from base class.

```typescript
import { DI } from "first-di";

class MyDI extends DI {
    // extended method
    public getAllSingletons(): IterableIterator<object> {
        return this.singletonsList.values();
    }
}
```
