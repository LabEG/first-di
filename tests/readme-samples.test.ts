/* eslint-disable no-shadow */
/* eslint-disable no-undef */
import("reflect-metadata"); // polyfill
import { assert } from "chai";
import { reset, override, autowired, reflection } from "../src";

describe("DI.ts", () => {
    describe("resolve dependencies", () => {
        afterEach(() => reset());

        it.only("sample in easy mode", async () => {
            // const { DemoController, DemoRepository, MockRepository } = await import("./controllers/EasySampleController");

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

            if (process.env.NODE_ENV !== "development") {
                assert.strictEqual(data, "production");
            } else {
                assert.strictEqual(data, "mock");
            }
        });
    });
});
