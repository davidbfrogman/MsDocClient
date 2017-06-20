import { Constants, TranslationConstants } from '../constants';
import { AttributeType } from 'enumerations';
import { Attribute, Entity } from 'models';
import { AttributeUtility } from 'utility';
import { Translator } from 'services';

export class EntityUtility {
    public static BuildMultiValueAttributes(entity: Entity): Entity {
        // Here we're going to drill down through the entities array on our entity object,
        // and surface the multivalue attributes so we can use them in drop downs etc.
        if (!entity.isMultiValueAttrBuilt) {
            if (entity && entity.entities && entity.entities.entity) {
                entity.entities.entity.forEach(childEntity => {
                    if (childEntity && childEntity.attrs && childEntity.attrs.attr) {
                        childEntity.attrs.attr.forEach(mvAttribute => {
                            if (!entity.multiValueAttributes) {
                                entity.multiValueAttributes = new Array<Attribute>();
                            }
                            mvAttribute.isMultiValue = true;
                            mvAttribute.name = mvAttribute.qual;
                            entity.multiValueAttributes.push(mvAttribute);
                        });
                    }
                });
            }
            entity.isMultiValueAttrBuilt = true;
            if (entity.multiValueAttributes) {
                entity.multiValueAttributes = entity.multiValueAttributes.sort();
            }
        }
        return entity;
    }

    public static IsEntityTemplateEnabled(entity: Entity): boolean {
        const attr = AttributeUtility.getAttributeBasedOnName(entity, Constants.TEMPLATE_ATTRIBUTE_NAME);
        return  (attr && attr.name && true); // get the cast to be of type boolean.
    }

    public static BuildDefaultAttributes(entity: Entity): Entity {
        if (!entity.isDefaultAttrBuilt) {
            if (!entity.defaultAttributes) {
                entity.defaultAttributes = new Array<Attribute>();
            }
            entity.defaultAttributes.push(AttributeUtility.buildDefaultAttributeByProp(Constants.ITEM_PROP_CREATED_BY));
            entity.defaultAttributes.push(AttributeUtility.buildDefaultAttributeByProp(Constants.ITEM_PROP_CREATED_TS));
            entity.defaultAttributes.push(AttributeUtility.buildDefaultAttributeByProp(Constants.ITEM_PROP_CHECKEd_OUT_BY));
            entity.defaultAttributes.push(AttributeUtility.buildDefaultAttributeByProp(Constants.ITEM_PROP_CHECKED_OUT_TS));
            entity.defaultAttributes.push(AttributeUtility.buildDefaultAttributeByProp(Constants.ITEM_PROP_LAST_CHANGED_BY));
            entity.defaultAttributes.push(AttributeUtility.buildDefaultAttributeByProp(Constants.ITEM_PROP_LAST_CHANGED_TS));
            entity.defaultAttributes.push(AttributeUtility.buildDefaultAttributeByProp(Constants.ITEM_PROP_SIZE));
            entity.defaultAttributes.push(AttributeUtility.buildDefaultAttributeByProp(Constants.ITEM_PROP_DISPLAY_NAME));
            entity.defaultAttributes.push(AttributeUtility.buildDefaultAttributeByProp(Constants.ITEM_PROP_FILENAME));
            entity.defaultAttributes.push(AttributeUtility.buildDefaultAttributeByProp(Constants.ITEM_PROP_ITEMID));
            entity.isDefaultAttrBuilt = true;
        }
        return entity;
    }

    // This method will ensure your entity object has a comprehensive list of both
    // regular attributes, and multivalue ones.  Including building out the default properties, like created on etc.
    public static BuildComprehensiveAttributes(entity: Entity): Entity {
        // Let's make sure we actually have mv attributes and we
        // have pushed them up to an easier to work with object on the entity.
        this.BuildMultiValueAttributes(entity);
        this.BuildDefaultAttributes(entity);

        if (!entity.isComprehensiveAttrBuilt) {
            if (!entity.comprehensiveAttributes) {
                entity.comprehensiveAttributes = new Array<Attribute>();
            }
            if (entity && entity.attrs && entity.attrs.attr) {
                entity.attrs.attr.forEach(regularAttribute => {
                    entity.comprehensiveAttributes.push(regularAttribute);
                });
            }
            if (entity.multiValueAttributes) {
                entity.multiValueAttributes.forEach(mvAttribute => {
                    entity.comprehensiveAttributes.push(mvAttribute);
                });
            }
            if (entity.defaultAttributes) {
                entity.defaultAttributes.forEach(defaultAttribute => {
                    entity.comprehensiveAttributes.push(defaultAttribute);
                });
            }
            if (entity.comprehensiveAttributes) {
                entity.comprehensiveAttributes = entity.comprehensiveAttributes.sort((a1, a2) => {
                    if (a1.name === a2.name) { return 0; }
                    return a1.name < a2.name ? -1 :  1;
                });
            }
            entity.isComprehensiveAttrBuilt = true;
        }
        return entity;
    }

    public static isSearchable(entity: Entity) {
        if (entity.search === 'true') {
            return true;
        } else {
            return false;
        }
    }
}
