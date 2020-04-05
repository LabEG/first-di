import { TestModel } from "../models/TestModel";
import { reflection } from "../../src/decorators/reflection";

@reflection
export class ProductionRepository {

    public async getData(): Promise<TestModel> {
        const data = new TestModel();
        data.repositoryData = "production";
        return await Promise.resolve(data);
    }

}
