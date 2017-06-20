import {
    Item,
    Collection,
    CollectionItem,
    Attribute,
    Resource,
    Resources,
    AttributeCollection,
    ResultListConfig,
    ResultListColumn,
    Entity
} from 'models';
import { ItemResourceType, AttributeType } from '../enumerations';
import { Constants } from '../constants';
import { environment } from '../environments/environment';
import { Translator, ResultListConfigurator, EntityConfigurator } from 'services';
import { AttributeUtility, EntityUtility } from 'utility';

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

    public static getAttributeBasedOnQual(item: Item, qual: string): Attribute {
        return item.attrs.attr.find((attribute) => {
            return attribute.qual === qual;
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

    public static isEditable(item: Item, currentUser: string): boolean {
        return ItemUtility.isCheckedOut(item) && item.checkedOutBy === currentUser;
    }

    public static getDisplayName(item: Item): string {
        const translator = Translator.getInstance();
        if (item.displayName) {
            return item.displayName; // TODO: formatAttributeValue
        } else {
            return translator.translate(translator.constants.NO_NAME); // TODO: IF no display name use translation NoName
        }
    }

    public static setUniqueId(item: Item): boolean {
        if (item.uniqueId === undefined || item.uniqueId === null) {
            item.uniqueId = this.computeUniqueId(item);
        }
        return true;
    }

    public static getTabId(item: Item): string {
        return 'tabs-' + item.uniqueId;
    }

    public static computeUniqueId(item: Item) {
        if (item.id !== undefined && item.id.length > 0) {
            return item.entityName + '-' + item.id;
        } else {
            return item.entityName + '-' + this.getRandomId();
        }
    }

    public static getRandomId() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
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

    public static setResultListProperties(item: Item): boolean {
        const resultListConfig: ResultListConfig = ResultListConfigurator.getInstance().getResultListConfigByEntityName(item.entityName);
        if(resultListConfig) {
            item.resultListProperties = resultListConfig.properties.property;
        } else {
            item.resultListProperties = Constants.RESULT_LIST_DEFAULT_PROPS;
        }
        return true;
    }

    public static getResultListAttribute(item: Item, property): Attribute {
        let attribute: Attribute = null;
        if (property.indexOf('prop:') === -1) {
            attribute = this.getAttributeBasedOnQual(item, property);
            if (attribute) {
                AttributeUtility.mapAttributeTypeEnumeration(attribute);
            }
        } else {
            const propertyName = property.substring(5);
            if (item.hasOwnProperty(propertyName)) {
                attribute = AttributeUtility.buildDefaultAttributeByProp(propertyName);
                if (attribute) {
                    attribute.value = item[propertyName];
                }
            }
        }
        return attribute;
    }

    public static setItem(items: Item[], value: Item, maxSize: number = null): boolean {
        ItemUtility.setUniqueId(value);
        ItemUtility.setResultListProperties(value);
        const foundIndex = items.findIndex((item) => {
            return item.uniqueId === value.uniqueId;
        });
        if (foundIndex !== -1) {
            items[foundIndex] = value;
        } else {
          this.addItemToCollection(items, value, maxSize);
        }
        return true;
    }

    private static addItemToCollection(collection: Item[], item: Item, maxSize: number): void {
      if (!maxSize === null || collection.length < maxSize) {
        collection.push(item);
      } else {
        collection.splice(0, 0, item);
        collection.pop();
      }
    }

    public static removeItemByUniqueId(items: Item[], uniqueId: string): boolean {
        const foundIndex = items.findIndex((item) => {
            return item.uniqueId === uniqueId;
        });
        if (foundIndex !== -1) {
            items = items.splice(foundIndex, 1);
            return true;
        }
        return false;
    }

    public static getItemByUniqueId(items: Item[], uniqueId: string): Item {
        let foundIndex: number = -1;
        items.forEach((item, index) => {
            if (item.uniqueId === uniqueId) {
                foundIndex = index;
                return;
            }
        });
        if (foundIndex !== -1) {
            return items[foundIndex];
        }
        return null;
    }

    public static isLatest(item: Item) {
        if (item.pid && item.pid.endsWith('HISTORY')) {
            return false;
        }
        return true;
    }
}
