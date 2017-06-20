import { BatchOperationType } from 'enumerations';

export class BatchOperation {
    public type: BatchOperationType;
    public input?: any;
    public output?: any;
    public exceptionMessage?: string;
    public exceptionDetail?: string;

    constructor(type: BatchOperationType, input: any) {
        this.type = type;
        this.input = input;
    }
}
