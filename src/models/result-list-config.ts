import { BaseModel } from './';
import { Attribute } from 'models/attribute';

export class ResultListConfig extends BaseModel  {
    name: string;
    properties: ResultListProperties;
}

export class ResultListProperties  {
    property: Array<string>;
}

export class ResultListColumn {
    constructor(public attribute: Attribute) { }
}
