import { autowired } from "../../src";
import { TestModel } from "../models/TestModel";
import { ProductionService } from "../services/ProductionService";

export class Controller {

    @autowired()
    private readonly productionService!: ProductionService;

    // constructor use library, don't use him for inject

    public async getCounter(): Promise<number> {
        return await this.productionService.getCounter();
    }

    public async getData(): Promise<TestModel> {
        return await this.productionService.getData();
    }

}
