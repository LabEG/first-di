import { autowired } from "../../src";
import { TestModel } from "../models/TestModel";
import { ImplProductionService } from "../services/ImplProductionService";

export class Controller {

    @autowired()
    private readonly productionService!: ImplProductionService;

    // constructor use library, don't use him for inject

    public async getCounter(): Promise<number> {
        return await this.productionService.getCounter();
    }

    public async getData(): Promise<TestModel> {
        return await this.productionService.getData();
    }

}
