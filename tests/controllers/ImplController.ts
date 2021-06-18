import {autowired} from "../../src";
import type {TestModel} from "../models/TestModel";
import {ImplProductionService} from "../services/ImplProductionService";

export class Controller {

    @autowired()
    private readonly productionService!: ImplProductionService;

    // Constructor use library, don't use him for inject

    public async getCounter (): Promise<number> {
        return this.productionService.getCounter();
    }

    public async getData (): Promise<TestModel> {
        return this.productionService.getData();
    }

}
