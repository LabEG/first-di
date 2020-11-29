/* eslint-disable no-shadow */
/* eslint-disable no-undef */
import("reflect-metadata"); // polyfill
import { assert } from "chai";
import { resolve, singleton, instance, reset } from "../src/index";

describe("DI.ts", () => {
    describe("api", () => {
        afterEach(() => {
            reset();
        });

        it("di must provide singleton api", async() => {
            const { ProductionService } = await import("./services/ProductionService");

            const singleton1 = singleton(ProductionService);
            const singleton2 = singleton(ProductionService);

            const data = await singleton1.getData();

            assert.strictEqual(data.serviceData, "production");
            assert.strictEqual(data.repositoryData, "production");
            assert.isBoolean(singleton1 === singleton2);
        });

        it("di must provide resolve api", async() => {
            const { ProductionService } = await import("./services/ProductionService");

            const singleton1 = resolve(ProductionService);
            const singleton2 = resolve(ProductionService);

            assert.isBoolean(singleton1 === singleton2);
        });

        it("di must provide instance api", async() => {
            const { ProductionService } = await import("./services/ProductionService");

            const singleton1 = instance(ProductionService);
            const singleton2 = instance(ProductionService);

            assert.isBoolean(singleton1 !== singleton2);
            assert.deepEqual(singleton1, singleton2);
        });
    });
});
