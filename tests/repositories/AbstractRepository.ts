import { TestModel } from "../models/TestModel";
import { reflection } from "../../src/decorators/reflection";

@reflection
export abstract class AbstractRepository {

    public abstract async getCounter(): Promise<number>;
    public abstract async getData(): Promise<TestModel>;

}
