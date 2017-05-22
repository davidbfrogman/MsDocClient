import { Item, Collection, CollectionItem, Attribute, Resource, Resources, AttributeCollection } from 'models';
import { ItemResourceType, AttributeType } from '../enumerations';
import { Constants } from '../constants';
import { environment } from '../environments/environment';

export class ItemUtility {

    public static hydrateTemplateDetailsOnItem(item: Item): Item {
        item.templateName = this.getAttributeBasedOnName(item, Constants.TEMPLATE_ATTRIBUTE_NAME).value;
        item.templateDescription = this.getAttributeBasedOnName(item, Constants.TEMPLATE_ATTRIBUTE_DESCRIPTION).value;
        item.templateThumbnail = ItemUtility.getResourceUrl(item, ItemResourceType.Thumbnail);
        return item;
    }

    public static getAttributeBasedOnName(item: Item, name: string): Attribute {
        return item.attrs.attr.find((attribute) => {
            return attribute.name === name;
        });
    }

    public static getResourceUrl(item: Item, itemResourceType: string): string {
        let resourceUrl: string;
        if (item && item.resrs && item.resrs.res) {
            item.resrs.res.forEach(resource => {
                if (resource.name.toLowerCase() === itemResourceType.toLowerCase()) {
                    resourceUrl = resource.url;
                }
            });
        }
        // If we couldn't match the resource type to the requested resource item.
        if (!resourceUrl) {
            throw new RangeError('The requested resource type was not present on the item');
        }
        return resourceUrl;
    }

    public static getResourceProperty(item: Item, itemResourceType: string, propertyName: string): string {
        let propertyValue: string = '';
        if (item && item.resrs && item.resrs.res) {
            item.resrs.res.forEach(resource => {
                if (resource.name.toLowerCase() === itemResourceType.toLowerCase()) {
                    propertyValue = resource[propertyName];
                }
            });
        }
        return propertyValue;
    }

    public static addAttribute(item: Item, qual: string, value: any, attributeType: AttributeType): void {
        if (qual.indexOf('\\') !== -1) {
            const qualParts = qual.split('\\');
            const coll = new Collection();
            coll.name = qualParts[0];
            coll.coll = [];
            const collItem = new CollectionItem();
            collItem.entityName = qualParts[0];
            const attrs = new AttributeCollection();
            attrs.attr = [];
            const newAttr = new Attribute();
            newAttr.name = qualParts[1];
            newAttr.qual = qual;
            newAttr.value = value;
            newAttr.type = attributeType.toString();
            attrs.attr.push(newAttr);
            collItem.attrs = attrs;
            coll.coll.push(collItem);
            if (item.colls === undefined) {
                item.colls = [];
            }
            item.colls.push(coll);
        } else {
            const newAttr: Attribute = new Attribute();
            newAttr.name = qual;
            newAttr.qual = qual;
            newAttr.value = value;
            newAttr.type = attributeType.toString();
            if (item.attrs === undefined) {
                item.attrs = new AttributeCollection();
            }
            if (item.attrs.attr === undefined) {
                item.attrs.attr = [];
            }
            item.attrs.attr.push(newAttr);
        }
    }

    public static addResource(
        item: Item,
        itemResourceType: string,
        filename: string,
        mimetype: string,
        base64: string,
        size: string
    ): void {
        const newResource = new Resource();
        newResource.name = itemResourceType;
        newResource.base64 = base64;
        newResource.filename = filename;
        newResource.size = size;
        newResource.mimetype = mimetype;
        newResource.url = ItemUtility.getResourceDefaulUrl(mimetype);

        if (item.resrs === undefined) {
            item.resrs = new Resources();
        }
        if (item.resrs.res === undefined) {
            item.resrs.res = [];
        } else {
            item.resrs.res = item.resrs.res.filter(e => {
                return e.name !== newResource.name;
            });
        }
        item.resrs.res.push(newResource);
        if (itemResourceType === ItemResourceType.Main) {
            item.filename = filename;
            item.size = size;
        }
    }
    public static isCheckedOut(item: Item): boolean {
        return item.checkedOutBy != null;
    }
    public static getDisplayName(item: Item): string {
        if (item.displayName) {
            return item.displayName; // TODO: formatAttributeValue
        } else {
            return 'NO NAME'; // TODO: IF no display name use translation NoName
        }
    }

    public static getResourceDefaulUrl(mimetype: string) {
        // TODO get the corect URL
        return environment.restUrls.ca + 'resource/defaultImage?$mimeType=' + encodeURIComponent(mimetype);
    }
    /**
     * Auto convert to appropriate unit B, KB, MB, GB
     * @param bytes nr of Bytes
     * @param decimals nr of decimals in output
     */
    public static formatBytes(bytes: number, decimals?: number): string {
        decimals = decimals || 2;

        if (bytes > 1073741824) {
            return (bytes / 1073741824).toFixed(decimals) + ' GB';
        } else if (bytes > 1048576) {
            return (bytes / 1048576).toFixed(decimals) + ' MB';
        } else if (bytes > 1024) {
            return (bytes / 1024).toFixed(decimals) + ' KB';
        } else {
            return bytes.toFixed(decimals) + ' B';
        }
    }

    public static editable(item: Item) {
        return item.checkedOutBy !== undefined;
    }

    public static isTheSameItem(item1: Item, item2: Item): boolean {
        return (item1.entityName === item2.entityName && item1.id === item2.id);
    }
}
