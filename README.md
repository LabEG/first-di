First DI
=====

Easy dependency injection for typescript applications

Description:
------
- For working this library needed Metadata Reflection API. If your platform (browser/nodejs) don't support it you must use polifyll. Example: [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
- For working reflection should be enabled the option emitDecoratorMetadata and experimentalDecorators.
- For generation reflection by typescript need to create any decorator or use @reflection decorator from this library

Using in Easy mode:
------
 Simply write code as you used to and use @autowired() decorator to implement dependencies. And to override dependencies, огые use method override.

```typescript
import { autowired, override, reflection } from "first-di";

@reflection // will generate reflection metadata
class DemoRepository { // default implementation

    public async getData(): Promise<string> {
        return await Promise.resolve("production");
    }

}

@reflection
class MockRepository implements DemoRepository { // mock implementation with same interface

    public async getData(): Promise<string> {
        return await Promise.resolve("mock");
    }

}

@reflection
class DemoService {

    constructor(private readonly demoRepository: DemoRepository) { }

    public async getData(): Promise<string> {
        return await this.demoRepository.getData();
    }

}

class DemoController {

    @autowired() // inject dependency
    private readonly demoService!: DemoService;

    public async getData(): Promise<string> {
        return await this.demoService.getData();
    }

}

if (process.env.NODE_ENV === "test") { // override in test environment
    override(DemoRepository, MockRepository);
}

const controllerInstance = new DemoController(); // create intance by framework
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

@reflection
class DemoRepository {

    public async getData(): Promise<string> {
        return await Promise.resolve("production");
    }

}

@reflection
class MockRepository implements DemoRepository {

    public async getData(): Promise<string> {
        return await Promise.resolve("mock");
    }

}

@reflection
class DemoService {

    // eslint-disable-next-line @typescript-eslint/no-parameter-properties
    constructor(private readonly demoRepository: DemoRepository) { }

    public async getData(): Promise<string> {
        return await this.demoRepository.getData();
    }

}

class DemoController {

    @autowired()
    private readonly demoService!: DemoService;

    public async getData(): Promise<string> {
        return await this.demoService.getData();
    }

}

if (process.env.NODE_ENV === "development") {
    override(DemoRepository, MockRepository);
}

const controllerInstance = new DemoController();
const data = await controllerInstance.getData();

if (process.env.NODE_ENV === "development") {
    assert.strictEqual(data, "mock");
} else {
    assert.strictEqual(data, "production");
}
```
