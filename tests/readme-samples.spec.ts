/* eslint-disable @stylistic/function-paren-newline */
/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
/* eslint-disable max-lines-per-function */

import "reflect-metadata"; // Polyfill
import {assert} from "chai";
import {reset, override, resolve, reflection} from "../src/index";
import {describe, it, afterEach} from "node:test";

describe("DI.ts", () => {
    describe("resolve dependencies", () => {
        afterEach(() => {
            reset();
        });

        it("sample in optional DI mode", async () => {
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
        });

        it("sample in classic DI mode", async () => {
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
        });
    });
});
