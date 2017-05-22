import { AttributeType } from 'enumerations';
import { IAttributable } from 'models';

export class Attribute {
    name: string;
    qual: string;
    type: string;
    desc?: string;
    value?: string;
    required?: string;
    unique?: string;
    searchable?: string;
    repr?: string;
    size?: string;
    vsEntity?: string;
    vsAttr?: string;
    valueset?: Valueset;
    max?: string;
    min?: string;
    default?: string;
    attributeType?: AttributeType;
    isAttributeTypeMapped?: boolean;
    isMultiValue?: boolean;
    isUserForSearching?: boolean;
    //used to check if this attribute is build as a default attribute
    isDefault?: boolean;
}

export class Value {
    name: string;
    desc: string;
}

export class Valueset {
    value: Value[];
}