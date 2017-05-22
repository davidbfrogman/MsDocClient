import { BaseModel } from 'models';

export class User extends BaseModel {
    public name: string;
    public email: string;
    public nameAndEmail: string;
}
