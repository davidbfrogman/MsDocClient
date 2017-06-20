import { BaseModel, BatchOperation } from 'models';

export class BatchOperations extends BaseModel {
    public batchOperation: BatchOperation[];
}
