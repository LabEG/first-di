import { reflection } from "../../src/decorators/reflection";
import { ProductionRepository } from "../repositories/ProductionRepository";
import { TestModel } from "../models/TestModel";

@reflection
export class ProductionService {

    private readonly productionRepository: ProductionRepository;

    constructor(productionRepository: ProductionRepository) {
        this.productionRepository = productionRepository;
    }

    public async getData(): Promise<TestModel> {
        const data = await this.productionRepository.getData();
        data.serviceData = "production";
        return data;
    }

}
