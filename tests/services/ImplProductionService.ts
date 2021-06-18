import {reflection} from "../../src/decorators/reflection";
import type {TestModel} from "../models/TestModel";
import {AbstractRepository} from "../repositories/AbstractRepository";

@reflection
export class ImplProductionService {

    private readonly productionRepository: AbstractRepository;

    public constructor (productionRepository: AbstractRepository) {
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
