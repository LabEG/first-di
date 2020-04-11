/* eslint-disable max-classes-per-file */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
import("reflect-metadata"); // polyfill
import { assert } from "chai";
import { reset, override, autowired, reflection } from "../src";

describe("DI.ts", () => {
    describe("resolve dependencies", () => {
        afterEach(() => reset());

        it("sample in easy mode", async() => {
            @reflection // typescript will generate reflection metadata
            class ProdRepository { // default implementation

                public async getData(): Promise<string> {
                    return await Promise.resolve("production");
                }

            }

            @reflection
            class MockRepository implements ProdRepository { // mock implementation with same interface

                public async getData(): Promise<string> {
                    return await Promise.resolve("mock");
                }

            }

            @reflection
            class ProdService {

                // eslint-disable-next-line @typescript-eslint/no-parameter-properties
                constructor(private readonly prodRepository: ProdRepository) { }

                public async getData(): Promise<string> {
                    return await this.prodRepository.getData();
                }

            }

            class ProdController {

                @autowired() // inject dependency
                private readonly prodService!: ProdService;

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
        });

        it("sample in pro mode", async() => {
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
        });
    });
});
