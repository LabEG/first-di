import {autowired, AutowiredLifetimes} from "../../src/index.js";
import type {TestModel} from "../models/TestModel";
import {ProductionService} from "../services/ProductionService";

export class Controller {

    @autowired({lifeTime: AutowiredLifetimes.PerInstance})
    private readonly productionService!: ProductionService;

    // Constructor use library, don't use him for inject

    public async getCounter (): Promise<number> {
        return this.productionService.getCounter();
    }

    public async getData (): Promise<TestModel> {
        return this.productionService.getData();
    }

}
