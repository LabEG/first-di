import type {TestModel} from "../models/TestModel";
import {reflection} from "../../src/decorators/reflection";

@reflection
export abstract class AbstractRepository {

    public abstract getCounter (): Promise<number>;

    public abstract getData (): Promise<TestModel>;

}
