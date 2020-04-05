import { autowired } from "../../src";
import { TestModel } from "../models/TestModel";
import { ProductionService } from "../services/ProductionService";

export class Controller {

    @autowired()
    private readonly productionService!: ProductionService;

    public async getData(): Promise<TestModel> {
        return await this.productionService.getData();
    }

}
