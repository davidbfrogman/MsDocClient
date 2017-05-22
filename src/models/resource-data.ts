import { BaseModel } from './';

export class ResourceData extends BaseModel {
    public mimeType: string;
    public filename: string;
    public httpStatus: number;
    public data: ArrayBuffer;
}
