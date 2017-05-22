import { Attribute, BaseModel, IAttributable, AttributeCollection } from 'models';
import { AttributeType } from 'enumerations';
import { Constants } from "../constants";
import { AttributeUtility } from 'utility';
import { Acls } from './acls';

export class Entity extends BaseModel implements IAttributable {
    public name: string;
    public desc: string;
    public root: string;
    public search: string;
    public resEnabled: string;
    public versionEnabled: string;
    public classification: string;
    public title: string;
    public id: string;
    public versioning: string;
    public templateEnabled: string; //Keep in mind this property doesn't get set on entity retrieval.  Only on entity creation.
    public caseSensitive: string;
    public externalIdEnabled: string;
    public localization?: any;
    public boolDefaultValue?: any;
    public mv: string;
    public attributes: Attribute[];
    public defAclRadio: string;
    public originalId: string;
    public representsItem: string;
    public defaultAcl: string;
    public reprItem: string;
    public attrs?: AttributeCollection;
    public acls: Acls;
    public entities: Entity;
    public entity: Entity[];
    public multiValueAttributes: Attribute[];  //A list of multivalue attributes that is built by entity utility
    public comprehensiveAttributes: Attribute[];  //A comprehnsive list of attributes( MultiValue + Regular ), that must be built by Entity Utility.
    public defaultAttributes: Attribute[]; //This is the list of default attributes, like createdBy, Size, etc
    public isMultiValueAttrBuilt: boolean;
    public isComprehensiveAttrBuilt: boolean;
    public isDefaultAttrBuilt: boolean;
}

export class Attributes {
    public attr: Attribute[];
}