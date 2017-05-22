import { Attribute, IAttributable, Valueset } from 'models';
import { AttributeType, FormFieldType } from 'enumerations';
import { Constants } from '../constants';
import * as moment from 'moment';

export class AttributeUtility {

    public static mapAttributeTypeEnumeration(attribute: Attribute): Attribute {
        // TODO: Figure out what short should map to.
        // there seems to be a conflict between short, and valueset
      if (!attribute.isAttributeTypeMapped) {
        switch (attribute.type) {
            case '1': // String
                attribute.attributeType = AttributeType.String;
                break;
            case '4': // Long
                attribute.attributeType = AttributeType.Long;
                break;
            case '6': // Decimal
                attribute.attributeType = AttributeType.Decimal;
                break;
            case '10': // Double
                attribute.attributeType = AttributeType.Double;
                break;
            case '7': // Date
                attribute.attributeType = AttributeType.Date;
                break;
            case '8': // Time
                attribute.attributeType = AttributeType.Time;
                break;
            case '9': // Timestamp
                attribute.attributeType = AttributeType.Timestamp;
                break;
            case '20': // Boolean
                attribute.attributeType = AttributeType.Boolean;
                break;
            case '3': // Short
                attribute.attributeType = AttributeType.Short;
                break;
            case '21': // GUID
                attribute.attributeType = AttributeType.GUID;
                break;
            default:
                break;
        }
        attribute.isAttributeTypeMapped = true;
      }
      return attribute;
    }

    public static buildDefaultAttribute(
        name: string, description: string,
        qualifyer: string,
        isUserForSearching: boolean,
        attributeType: AttributeType,
        isValueset: boolean,
        value?: any
    ): Attribute {
        const attribute = new Attribute();
        attribute.attributeType = attributeType;
        attribute.isUserForSearching = isUserForSearching;
        if (isValueset) {
            attribute.vsEntity = 'vsEntity';
        }
        attribute.isMultiValue = false;
        attribute.name = name;
        attribute.desc = description;
        attribute.qual = qualifyer;
        if (value === undefined) {
            value = AttributeUtility.computeDefaultValue(attribute);
        }
        attribute.value = value;
        attribute.isDefault = true;
        return attribute;
    }

    public static computeDefaultValue(attribute: Attribute): any {
        let attributeValue: any = null;
        switch (attribute.attributeType) {
            case AttributeType.Boolean:
            case AttributeType.Short:
            case AttributeType.Long:
            case AttributeType.Decimal:
            case AttributeType.Double:
            case AttributeType.String:
            case AttributeType.MultiValue:
                attributeValue = '';
                break;
            case AttributeType.Date:
                attributeValue = moment().format(Constants.MOMENT_API_DATE_FORMAT);
            break;
            case AttributeType.Time:
                attributeValue = moment().format(Constants.MOMENT_API_TIME_FORMAT);
            break;
            case AttributeType.Timestamp:
                attributeValue = moment().format(Constants.MOMENT_API_DATETIME_FORMAT);
        }

        return attributeValue;
    }

    public static getAttributeBasedOnName(item: IAttributable, name: string): Attribute {
        return item.attrs.attr.find((attribute) => {
            return attribute.name === name;
        });
    }

    public static getFormFieldType(attribute: Attribute): number {
        let attributeFieldType: number = null;
        if (AttributeUtility.isValueset(attribute)) {
            return FormFieldType.Dropdown;
        }
        switch (attribute.attributeType) {
            case AttributeType.Boolean:
                attributeFieldType = FormFieldType.Boolean;
                break;
            case AttributeType.Short:
            case AttributeType.Long:
            case AttributeType.Decimal:
            case AttributeType.Double:
                attributeFieldType = FormFieldType.Number;
                break;
            case AttributeType.String:
            case AttributeType.MultiValue:
            case AttributeType.GUID:
                attributeFieldType = FormFieldType.String;
                break;
            case AttributeType.Date:
                attributeFieldType = FormFieldType.DatePicker;
            break;
            case AttributeType.Time:
                attributeFieldType = FormFieldType.TimePicker;
                break;
            case AttributeType.Timestamp:
                attributeFieldType = FormFieldType.DateTimePicker;
                break;
        }

        return attributeFieldType;
    }

    public static getApiValue(attribute: Attribute, value?: string): string {
        let stringValue: string = undefined;
        if (value === undefined) {
            value = attribute.value;
        }
        switch (attribute.attributeType) {
            case AttributeType.Boolean:
                stringValue = value;
                return stringValue;
            case AttributeType.Decimal:
            case AttributeType.Double:
            case AttributeType.Long:
            case AttributeType.MultiValue:
            case AttributeType.Short:
            case AttributeType.String:
            case AttributeType.GUID:
                stringValue = value;
                return stringValue;
            case AttributeType.Date:
                stringValue = moment(value, Constants.MOMENT_FORM_DATE_FORMAT).format(Constants.MOMENT_API_DATE_FORMAT);
                return stringValue;
            case AttributeType.Time:
                stringValue = moment(value, Constants.MOMENT_FORM_TIME_FORMAT).format(Constants.MOMENT_API_TIME_FORMAT);
                return stringValue;
            case AttributeType.Timestamp:
                stringValue = moment(value, Constants.MOMENT_FORM_DATETIME_FORMAT).format(Constants.MOMENT_API_DATETIME_FORMAT);
                return stringValue;
            default:
                return undefined;
        }
    }

    public static getFormValue(attribute: Attribute): string {
        let stringValue: string = undefined;
        let attributeValue: string = undefined;
        if (attribute.value === undefined) {
            attributeValue = attribute.default;
        } else {
            attributeValue = attribute.value;
        }
        switch (attribute.attributeType) {
            case AttributeType.Boolean:
                stringValue = attributeValue;
                return stringValue;
            case AttributeType.Decimal:
            case AttributeType.Double:
            case AttributeType.Long:
            case AttributeType.MultiValue:
            case AttributeType.Short:
            case AttributeType.String:
            case AttributeType.GUID:
                stringValue = attributeValue;
                return stringValue;
            case AttributeType.Date:
                stringValue = moment(attributeValue, Constants.MOMENT_API_DATE_FORMAT).format(Constants.MOMENT_FORM_DATE_FORMAT);
                return stringValue;
            case AttributeType.Time:
                stringValue = moment(attributeValue, Constants.MOMENT_API_TIME_FORMAT).format(Constants.MOMENT_FORM_TIME_FORMAT);
                return stringValue;
            case AttributeType.Timestamp:
                stringValue = moment(attributeValue, Constants.MOMENT_API_DATETIME_FORMAT).format(Constants.MOMENT_FORM_DATETIME_FORMAT);
                return stringValue;
            default:
                return undefined;
        }
    }

    public static getMaxlength(attribute: Attribute): string {
        return attribute.size;
    }

    public static getRequired(attribute: Attribute): boolean {
        return (attribute.required === 'true');
    }

    public static getUnique(attribute: Attribute): boolean {
        return (attribute.unique === 'true');
    }

    public static getBooleanValueset(): Valueset {
        return {
            value: [{name: 'true',  'desc': 'true'}, {name: 'false',  desc: 'false'}]
        };
    }

    public static isValueset(attribute: Attribute): boolean {
        if (attribute.vsEntity) {
            return true;
        }
        return false;
    }

    public static getValueset(attribute: Attribute): Valueset {
        if (AttributeUtility.isValueset(attribute)) {
            return attribute.valueset;
        }
        return undefined;
    }
}
