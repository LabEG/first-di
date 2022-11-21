/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
/* eslint-disable max-lines-per-function */
import "reflect-metadata"; // Polyfill
import {assert} from "chai";
import {reset, override, autowired, reflection} from "../src/index";

describe("DI.ts", () => {
    describe("resolve dependencies", () => {
        afterEach(() => {
            reset();
        });

        it("sample in easy mode", async () => {
            @reflection // Typescript will generate reflection metadata
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

                // eslint-disable-next-line @typescript-eslint/parameter-properties
                public constructor (private readonly prodRepository: ProdRepository) { }

                public async getData (): Promise<string> {
                    return this.prodRepository.getData();
                }

            }

            class ProdController {

                @autowired() // Inject dependency
                private readonly prodService!: ProdService;

                public async getData (): Promise<string> {
                    return this.prodService.getData();
                }

            }

            if (process.env.NODE_ENV === "test") { // Override in test environment
                override(ProdRepository, MockRepository);
            }

            const controllerInstance = new ProdController(); // Create intance by framework
            const data = await controllerInstance.getData();

            if (process.env.NODE_ENV === "test") {
                assert.strictEqual(data, "mock");
            } else {
                assert.strictEqual(data, "production");
            }
        });

        it("sample in pro mode", async () => {
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

            class ProdController {

                @autowired()
                private readonly prodService!: AbstractService;

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
