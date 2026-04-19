import {reflection} from "../../src/decorators/reflection.js";
import {ProductionRepository} from "../repositories/ProductionRepository.js";
import type {TestModel} from "../models/TestModel.js";

@reflection
export class ProductionService {

    private readonly productionRepository: ProductionRepository;

    public constructor (productionRepository: ProductionRepository) {
        this.productionRepository = productionRepository;
    }

    public async getCounter (): Promise<number> {
        return this.productionRepository.getCounter();
    }

    public async getData (): Promise<TestModel> {
        const data = await this.productionRepository.getData();
        data.serviceData = "production";
        return data;
    }

}
