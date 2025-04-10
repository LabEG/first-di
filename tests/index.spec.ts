/* eslint-disable max-lines-per-function */

import "reflect-metadata"; // Polyfill
import {assert} from "chai";
import {reset, override} from "../src/index";
import {ProductionRepository} from "./repositories/ProductionRepository";
import {MockRepository} from "./repositories/MockRepository";
import {AbstractRepository} from "./repositories/AbstractRepository";
import {ImplMockRepository} from "./repositories/ImplMockRepository";
import {describe, it, afterEach} from "node:test";

describe("DI.ts", () => {
    describe("resolve dependencies", () => {
        afterEach(() => {
            reset();
        });

        it("DI must resolve dependencies", async () => {
            const {Controller} = await import("./controllers/Controller");

            const controllerInstance = new Controller();
            const data = await controllerInstance.getData();

            assert.strictEqual(data.serviceData, "production");
            assert.strictEqual(data.repositoryData, "production");
        });

        it("DI must create singleton services", async () => {
            const {Controller} = await import("./controllers/Controller");

            const controllerInstance1 = new Controller();
            const counter1 = await controllerInstance1.getCounter();

            const controllerInstance2 = new Controller();
            const counter2 = await controllerInstance2.getCounter();

            assert.strictEqual(counter1, 1);
            assert.strictEqual(counter2, 2);
        });

        it("DI must reset state", async () => {
            const {Controller} = await import("./controllers/Controller");

            const controllerInstance1 = new Controller();
            const counter1 = await controllerInstance1.getCounter();

            reset();

            const controllerInstance2 = new Controller();
            const counter2 = await controllerInstance2.getCounter();

            assert.strictEqual(counter1, 1);
            assert.strictEqual(counter2, 1);
        });

        it("DI must support multiple scopes", async () => {
            const {Controller} = await import("./controllers/ScopesController");

            const controllerInstance = new Controller();
            const dataA = await controllerInstance.getCounterScopeA();
            const dataB = await controllerInstance.getCounterScopeB();

            assert.strictEqual(dataA, 1);
            assert.strictEqual(dataB, 1);
        });

        it("DI must support per-instance injection", async () => {
            const {Controller} = await import("./controllers/PerInstanceController");

            const controllerInstance1 = new Controller();
            const controllerInstance2 = new Controller();
            const data1 = await controllerInstance1.getCounter();
            const data2 = await controllerInstance1.getCounter();
            const data3 = await controllerInstance2.getCounter();

            assert.strictEqual(data1, 1);
            assert.strictEqual(data2, 2);
            assert.strictEqual(data3, 1);
        });

        it("DI must override dependency", async () => {
            override(ProductionRepository, MockRepository);

            const {Controller} = await import("./controllers/Controller");

            const controllerInstance = new Controller();
            const data = await controllerInstance.getData();

            assert.strictEqual(data.serviceData, "production");
            assert.strictEqual(data.repositoryData, "mock");
        });

        it("DI must override abstract dependency", async () => {
            override(AbstractRepository, ImplMockRepository);

            const {Controller} = await import("./controllers/ImplController");

            const controllerInstance = new Controller();
            const data = await controllerInstance.getData();

            assert.strictEqual(data.serviceData, "production");
            assert.strictEqual(data.repositoryData, "mock");
        });
    });
});
