import { reflection } from "../../src/decorators/reflection";
import { TestModel } from "../models/TestModel";
import { AbstractRepository } from "../repositories/AbstractRepository";

@reflection
export class ImplProductionService {

    private readonly productionRepository: AbstractRepository;

    constructor(productionRepository: AbstractRepository) {
        this.productionRepository = productionRepository;
    }

    public async getCounter(): Promise<number> {
        return await this.productionRepository.getCounter();
    }

    public async getData(): Promise<TestModel> {
        const data = await this.productionRepository.getData();
        data.serviceData = "production";
        return data;
    }

}
