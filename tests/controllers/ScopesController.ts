
import {DI} from "../../src";
import type {TestModel} from "../models/TestModel";
import {ProductionService} from "../services/ProductionService";

const scopeA = new DI();
const scopeB = new DI();

export class Controller {

    @scopeA.autowired()
    private readonly productionServiceScopeA!: ProductionService;

    @scopeB.autowired()
    private readonly productionServiceScopeB!: ProductionService;

    // Constructor use library, don't use him for inject

    public async getCounterScopeA (): Promise<number> {
        return this.productionServiceScopeA.getCounter();
    }

    public async getDataScopeA (): Promise<TestModel> {
        return this.productionServiceScopeA.getData();
    }

    public async getCounterScopeB (): Promise<number> {
        return this.productionServiceScopeB.getCounter();
    }

    public async getDataScopeB (): Promise<TestModel> {
        return this.productionServiceScopeB.getData();
    }

}
