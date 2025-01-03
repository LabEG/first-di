import {TestModel} from "../models/TestModel";
import {reflection} from "../../src/decorators/reflection";
import type {AbstractRepository} from "./AbstractRepository";

@reflection
export class ImplProductionRepository implements AbstractRepository {

    private requestCounter: number = 0;

    public async getCounter (): Promise<number> {
        this.requestCounter += 1;
        return Promise.resolve(this.requestCounter);
    }


    public async getData (): Promise<TestModel> {
        const data = new TestModel();
        data.repositoryData = "production";
        return Promise.resolve(data);
    }

}
