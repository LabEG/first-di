/* eslint-disable no-shadow */
/* eslint-disable no-undef */
import("reflect-metadata"); // polyfill
import { assert } from "chai";
import { reset } from "../src";

describe("DI.ts", () => {
    describe("resolve dependencies", () => {
        afterEach(() => reset());

        it("di must resolve dependecies", async() => {
            const { Controller } = await import("./controllers/Controller");

            const controllerInstance = new Controller();
            const dataFromRepository = await controllerInstance.getData();

            assert.strictEqual(dataFromRepository.serviceData, "production", "Service data must be 'production'");
            assert.strictEqual(dataFromRepository.repositoryData, "production", "Repository data must be 'production'");
        });

        it("di must create singleton services", async() => {
            const { Controller } = await import("./controllers/Controller");

            const controllerInstance1 = new Controller();
            const counter1 = await controllerInstance1.getCounter();

            const controllerInstance2 = new Controller();
            const counter2 = await controllerInstance2.getCounter();

            assert.strictEqual(counter1, 1);
            assert.strictEqual(counter2, 2);
        });

        it("di must reset di state", async() => {
            const { Controller } = await import("./controllers/Controller");

            const controllerInstance1 = new Controller();
            const counter1 = await controllerInstance1.getCounter();

            reset();

            const controllerInstance2 = new Controller();
            const counter2 = await controllerInstance2.getCounter();

            assert.strictEqual(counter1, 1);
            assert.strictEqual(counter2, 1);
        });

        it("di must support multiple scopes", async() => {
            const { Controller } = await import("./controllers/ScopesController");

            const controllerInstance = new Controller();
            const dataA = await controllerInstance.getCounterScopeA();
            const dataB = await controllerInstance.getCounterScopeB();

            assert.strictEqual(dataA, 1);
            assert.strictEqual(dataB, 1);
        });
    });
});
