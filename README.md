# First-DI

[![npm version](https://img.shields.io/npm/v/first-di.svg)](https://www.npmjs.com/package/first-di)
[![npm downloads](https://img.shields.io/npm/dm/first-di.svg)](https://www.npmjs.com/package/first-di)
[![license](https://img.shields.io/npm/l/first-di.svg)](https://github.com/LabEG/first-di/blob/master/LICENSE)
[![Build Status](https://github.com/LabEG/first-di/workflows/Test%20Pull%20Request/badge.svg)](https://github.com/LabEG/first-di/actions)
[![CodeQL](https://github.com/LabEG/first-di/workflows/CodeQL%20Advanced/badge.svg)](https://github.com/LabEG/first-di/security/code-scanning)

Lightweight and powerful dependency injection container for TypeScript applications

---

## Overview

**first-di** is a modern, type-safe dependency injection container designed specifically for TypeScript applications. It provides a clean and intuitive API for managing dependencies with minimal configuration and zero runtime dependencies.

### Key Features

- 🚀 **Zero Dependencies** - No external runtime dependencies required
- 💡 **Two Operation Modes** - Optional DI for simplicity, Classic DI for advanced scenarios
- 🔄 **Multiple Lifecycles** - Singleton, Transient, Per-Instance, and Per-Access patterns
- 🎯 **Type-Safe** - Full TypeScript support with decorator-based metadata
- 🔧 **Flexible Scoping** - Support for multiple isolated DI containers
- 🧪 **Test-Friendly** - Easy mocking and overriding for unit tests
- 📦 **Extensible** - Built on OOP/SOLID principles for easy customization

---

## Installation

For the latest stable version:

```bash
npm i first-di
```

## Quick Start

### Prerequisites

Install [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) package and import it in your application entry point:

```bash
npm install reflect-metadata
```

Enable the following compiler options in `tsconfig.json`:

```json
{
    "compilerOptions": {
        ...
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        ...
    }
}

```

---

## Usage

### Optional DI Mode

The simplest approach - write classes and inject dependencies through constructors. All dependencies are automatically resolved when calling `resolve()`.

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

### Classic DI Mode

For advanced scenarios, use abstract classes as contracts instead of interfaces. Abstract classes generate runtime metadata that TypeScript interfaces cannot provide.

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

## Options

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

## Scopes

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

---

## API Reference

### Core Functions

- **`override(fromClass, toClass, options?)`** - Override dependency resolution with custom implementation
- **`resolve(class, options?)`** - Resolve dependency with specified or default options
- **`singleton(class)`** - Resolve as singleton instance
- **`instance(class)`** - Always create new instance
- **`reset()`** - Clear all singletons and overrides (preserves global options)

### Service Locator Pattern

The API functions can be used to implement the Service Locator pattern:

```typescript
import { singleton, instance, resolve, AutowiredLifetimes } from "first-di";

class ApiDemo {

    private readonly service3: ApiService3 = resolve(ApiService3, { lifeTime: AutowiredLifetimes.PER_INSTANCE });

    private readonly service4: ApiService4 = singleton(ApiService4);

    private readonly service5: ApiService5 = instance(ApiService5);

}
```

---

## Advanced Usage

### Extending the DI Container

Built on OOP and SOLID principles, every component can be extended or customized:

```typescript
import { DI } from "first-di";

class MyDI extends DI {
    // extended method
    public getAllSingletons(): IterableIterator<object> {
        return this.singletonsList.values();
    }
}
```

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting pull requests.

## License

MIT © [Eugene Labutin](https://github.com/LabEG)
