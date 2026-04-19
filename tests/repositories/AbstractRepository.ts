import type {TestModel} from "../models/TestModel.js";
import {reflection} from "../../src/decorators/reflection.js";

@reflection
export abstract class AbstractRepository {

    public abstract getCounter (): Promise<number>;

    public abstract getData (): Promise<TestModel>;

}
