/* eslint-disable no-shadow */
/* eslint-disable no-undef */
import("reflect-metadata"); // polyfill
import { assert } from "chai";

describe("DI.ts", () => {
    describe("resolve dependencies", () => {
        it("di must resolve dependecies", async() => {
            const { Controller } = await import("./controllers/Controller");

            const controllerInstance = new Controller();
            const dataFromRepository = await controllerInstance.getData();

            assert.strictEqual(dataFromRepository.serviceData, "production", "Service data must be 'production'");
            assert.strictEqual(dataFromRepository.repositoryData, "production", "Repository data must be 'production'");
        });
    });
});
