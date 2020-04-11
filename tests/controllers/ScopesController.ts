
import { DI } from "../../src";
import { TestModel } from "../models/TestModel";
import { ProductionService } from "../services/ProductionService";

const scopeA = new DI();
const scopeB = new DI();

export class Controller {

    @scopeA.autowired()
    private readonly productionServiceScopeA!: ProductionService;

    @scopeB.autowired()
    private readonly productionServiceScopeB!: ProductionService;

    // constructor use library, don't use him for inject

    public async getCounterScopeA(): Promise<number> {
        return await this.productionServiceScopeA.getCounter();
    }

    public async getDataScopeA(): Promise<TestModel> {
        return await this.productionServiceScopeA.getData();
    }

    public async getCounterScopeB(): Promise<number> {
        return await this.productionServiceScopeB.getCounter();
    }

    public async getDataScopeB(): Promise<TestModel> {
        return await this.productionServiceScopeB.getData();
    }

}
