import { BaseModel } from './';
import { Attribute } from './attribute';
import { AttributeType } from '../enumerations';
import { AttributeCollection, Acl } from 'models';
import { IAttributable } from 'models/interfaces/IAttributable';

export class Item extends BaseModel implements IAttributable  {
    public pid?: string;
    public id?: string;
    public version?: string;
    public entityName?: string;
    public checkedOutBy?: string;
    public checkedOutByName?: string;
    public checkedOutTimestamp?: string;
    public createdBy?: string;
    public createdByName?: string;
    public createdTimestamp?: string;
    public lastChangedBy?: string;
    public lastChangedByName?: string;
    public lastChangedTimestamp?: string;
    public filename?: string;
    public size?: string;
    public displayName?: string;
    public attrs?: AttributeCollection;
    public resrs?: Resources;
    public colls?: Collection[];
    public acl?: Acl;
    public templateName?: string;
    public templateDescription?: string;
    public templateThumbnail?: string;

    public constructor() {
        super();
    }
}

export class Collection {
    public name: string;
    public coll: CollectionItem[];
}

export class CollectionItem implements IAttributable {
    public entityName: string;
    public attrs: AttributeCollection;
}

export class Resources {
    public res: Resource[];
}

export class Resource {
    public name: string;
    public size: string;
    public mimetype: string;
    public filename: string;
    public url: string;
    public sha256: string;
    public base64: string;
}
