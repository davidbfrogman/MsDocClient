import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Constants } from '../../constants';
import { OperationType, AttributeType } from 'enumerations';
import { Attribute, Entity, Operation, SearchStack } from 'models';
import { AttributeUtility, EntityUtility } from 'utility';


@Injectable()
export class XQueryBuilder {
    protected entity: Entity = null;
    protected attribute: Attribute = null;
    protected operation: Operation = null;
    protected operand: string = null;
    protected freeTextSearchOperand: string = null;
    protected searchStacks = Array<SearchStack>();
    protected entityList = Array<Entity>();
    protected searchOrganizers = Array<SearchOrganizer>();

    constructor() {
        return this;
    }

    withConfig(configuration?: XQueryConfigType): XQueryBuilder {
        if (configuration === undefined) {
            this.entity = null;
            this.attribute = null;
            this.operation = null;
            return this;
        }

        // Required Properties
        this.entity = configuration.entity !== undefined && configuration.entity.attrs ? configuration.entity : null;
        this.operation = configuration.operation !== undefined ? configuration.operation : null;
        this.attribute = configuration.attribute !== undefined ? configuration.attribute : null;

        // Optional Arguments
        if (configuration.freeTextSearchOperand !== undefined) {
            this.freeTextSearchOperand = configuration.freeTextSearchOperand;
        }
        if (configuration.operand !== undefined) {
            this.operand = configuration.operand;
        }
        if (configuration.searchStacks !== undefined) {
            // I'm going to modify the search stack array that's passed in so we want to create a copy.
            this.searchStacks = configuration.searchStacks.slice(0);
        }
        if (configuration.entityList !== undefined) {
            // I'm going to modify the entityList array that's passed in so we want to create a copy.
            this.entityList = configuration.entityList.slice(0);
        }

        return this;
    }

    build() {
        const xQueryParts: Array<string> = [];
        let xQuerySearchOrgParts: Array<string> = [];
        let xQuerySearchOperatorParts: Array<string> = [];
        let xQuerySearchAttributeParts: Array<string> = [];
        this.organizeSearchSummaries();
        // pattern = /entityNameWithUnderscores[@attribute = ""]
        // pattern = /entityNameWithUnderscores[@attribute != ""]
        // pattern = /entityNameWithUnderscores[@attribute LIKE ""]
        // pattern = /entityNameWithUnderscores[@attribute NOT LIKE ""]
        // pattern = /entityNameWithUnderscores[@ValuesetAttribute = "IMAGE"]
        // pattern = /entityNameWithUnderscores[@BooleanAttribute = true]
        // pattern = /entityNameWithUnderscores[@BooleanAttribute = false]
        // pattern = /entityNameWithUnderscores[@BooleanAttribute IS NULL]
        // pattern = /entityNameWithUnderscores[@BooleanAttribute IS NOT NULL]
        // pattern = /entityNameWithUnderscores[@DateAttribute = "2017-03-07T02:04:05.000Z"]
        // pattern = /entityNameWithUnderscores[@DateAttribute <= "2017-03-07T02:04:05.000Z"]
        // /WF_test[@CHECKEDOUTTS = "2017-11-11T14:04:24.000Z"])
        // free text search pattern (/WF_test[@CHECKEDOUTUSERID = "asdf"]) INTERSECT CONTAINS(/WF_test, "asdf")
        // multi value pattern = /WF_test[DaveMultiValue/@Value = "test"]
        // /Customer[@CHECKEDOUTUSERID = "niclas.vestlund@infor.com"] UNION
        //   /MDS_GenericDocument[@MDS_AccountingEntity = "accentity" AND @RESOURCENAME = "test"] UNION /EAM[@RESOURCENAME = "new"]
        // (/MDS_File[@displayName = "asdf" AND @RESOURCESIZE = "22"] UNION
        //   /Customer[@RESOURCESIZE = "22"]) INTERSECT CONTAINS(/Customer|/MDS_File, "456")

        this.searchOrganizers.forEach((so, soIndex) => {
            xQuerySearchOrgParts = [];
            xQuerySearchAttributeParts = [];
            so.attributeOrganizerList.forEach((ao, aoIndex) => {
                xQuerySearchOperatorParts = [];
                if (ao && ao.attribute && ao.operationType && ao.attribute.name && ao.attribute.name.length > 0) {
                    AttributeUtility.mapAttributeTypeEnumeration(ao.attribute);
                    if (!ao.attribute.isMultiValue) {
                        xQuerySearchOperatorParts.push(`@${ao.attribute.qual}`);
                    } else {
                        // "DavesMVAttribute/Value" --> DavesMVAttribute/@Value
                        let mvName = ao.attribute.qual;
                        mvName = mvName.replace(`/`, `/@`);
                        xQuerySearchOperatorParts.push(`${mvName}`);
                    }

                    // If someone passed in null for the string operand, we want to search on empty string.
                    if (ao.operand == null) {
                        ao.operand = '';
                    }

                    // We change the formatting for searching.
                    if (ao.attribute.attributeType === AttributeType.Timestamp) {
                        ao.operand = this.getDateTimeFormattedForSearch(ao.operand);
                    }

                    if (ao.attribute.attributeType === AttributeType.Time) {
                        ao.operand = this.getTimeFormattedForSearch(ao.operand);
                    }

                    // Build out the operation, and operand
                    switch (ao.operationType) {
                        case OperationType.NotEqual:
                            xQuerySearchOperatorParts.push(` != "${ao.operand}"`);
                            break;
                        case OperationType.EqualTo:
                            xQuerySearchOperatorParts.push(` = "${ao.operand}"`);
                            break;
                        case OperationType.Like:
                            xQuerySearchOperatorParts.push(` LIKE "${ao.operand}"`);
                            break;
                        case OperationType.NotLike:
                            xQuerySearchOperatorParts.push(` NOT LIKE "${ao.operand}"`);
                            break;
                        case OperationType.True:
                            xQuerySearchOperatorParts.push(` = true`);
                            break;
                        case OperationType.False:
                            xQuerySearchOperatorParts.push(` = false`);
                            break;
                        case OperationType.HasValue:
                            xQuerySearchOperatorParts.push(` IS NOT NULL`);
                            break;
                        case OperationType.NoValue:
                            xQuerySearchOperatorParts.push(` IS NULL`);
                            break;
                        case OperationType.After:
                            xQuerySearchOperatorParts.push(` > "${ao.operand}"`);
                            break;
                        case OperationType.AfterOrEqual:
                            xQuerySearchOperatorParts.push(` >= "${ao.operand}"`);
                            break;
                        case OperationType.Before:
                            xQuerySearchOperatorParts.push(` < "${ao.operand}"`);
                            break;
                        case OperationType.BeforeOrEqual:
                            xQuerySearchOperatorParts.push(` <= "${ao.operand}"`);
                            break;
                        default:
                            break;
                    }
                    const xQuerySearchOperatorPartsJoin = xQuerySearchOperatorParts.join(``);
                    xQuerySearchAttributeParts.push(xQuerySearchOperatorPartsJoin);
                }
            }); // End of loop for Attribute Search searchSummaries
            if (so.entity) {
                xQuerySearchOrgParts.push(`/${so.entity.name}`);
            }
            if (xQuerySearchAttributeParts.length > 0) {
                xQuerySearchOrgParts.push(`[`);
                const xQuerySearchAttributePartsJoin = xQuerySearchAttributeParts.join(` AND `);
                xQuerySearchOrgParts.push(xQuerySearchAttributePartsJoin);
                xQuerySearchOrgParts.push(`]`);
            }

            if (so.freeTextSearchOperand && so.freeTextSearchOperand.length > 0) {
                // (/WF_test[@CHECKEDOUTUSERID = "asdf"]) INTERSECT CONTAINS(/WF_test, "asdf")
                // First we need to wrap what we have built at this point in parenthesis.
                const xQuerySearchOrgPartsLength = xQuerySearchOrgParts.length;
                const xQueryFreeTextParts = [];
                if (so.entity) {
                    if (EntityUtility.isSearchable(so.entity)) {
                        xQueryFreeTextParts.push(`/${so.entity.name}`);
                    }
                } else {
                    if (this.entityList && this.entityList.length > 0) {
                        this.entityList.forEach((entity: Entity) => {
                            if (EntityUtility.isSearchable(entity)) {
                                xQueryFreeTextParts.push(`/${entity.name}`);
                            }
                        });
                    }
                }
                if (xQueryFreeTextParts.length > 0) {
                    if (xQuerySearchOrgPartsLength > 0) {
                        xQuerySearchOrgParts.splice(0, null, `(`);
                        xQuerySearchOrgParts.push(`)`);
                        xQuerySearchOrgParts.push(` INTERSECT`);
                    }
                    xQuerySearchOrgParts.push(` CONTAINS(`);
                    xQuerySearchOrgParts.push(xQueryFreeTextParts.join('|'));
                    xQuerySearchOrgParts.push(`, "${this.freeTextSearchOperand}")`);
                }
            }

            // Then we wrap the whole thing
            if (soIndex !== this.searchOrganizers.length - 1 ) {
                xQuerySearchOrgParts.splice(0, null, `(`);
                xQuerySearchOrgParts.push(`) `);
            }
            const xQueryPartsJoin: string = xQuerySearchOrgParts.join('');
            if (xQueryPartsJoin.length > 0) {
                xQueryParts.push(xQueryPartsJoin);
            }
        });

        let xQueryPartsJoin: string;
        if (xQueryParts.length <= 1) {
            xQueryPartsJoin = xQueryParts.join('');
        } else {
            xQueryPartsJoin = xQueryParts.join(` UNION `);
        }

        return xQueryPartsJoin;
    }

    public organizeSearchSummaries() {
        if (!this.searchStacks) {
            this.searchStacks = new Array<SearchStack>();
        }

        if (this.getSearchStackFromConfig().entity) {
            this.searchStacks.push(this.getSearchStackFromConfig());
        } else {
            let foundSeachableEntity = false;
            if (this.entityList && this.entityList.length > 0) {
                this.entityList.forEach((entity: Entity) => {
                    if (EntityUtility.isSearchable(entity)) {
                        foundSeachableEntity = true;
                    }
                    return;
                });
            }
            if (foundSeachableEntity) {
                this.searchStacks.push(this.getSearchStackFromConfig());
            }
        }

        this.searchStacks.forEach(searchStack => {
            // Search for an existing search summary, using entity as our 'key'
            const existingSearchSummary = this.searchOrganizers.find((searchSummary) => {
                return searchSummary.entity === searchStack.entity;
            });
            // If we didn't find an existing search summary for this entity,
            // then we need to add one.
            if (!existingSearchSummary) {
                this.searchOrganizers.push(SearchOrganizer.buildSearchOrganizer(searchStack));
            } else {
                if (searchStack.attribute !== null) {
                    // Here we found an existing search summary, so we need to add properties to it's attributes
                    existingSearchSummary.attributeOrganizerList.push(AttributeOrganizer.buildAttributeOrganizer(searchStack));
                }
            }
        });
    }

    public getSearchStackFromConfig(): SearchStack {
        return new SearchStack(
            this.entity,
            this.attribute,
            this.operation,
            this.operand,
            this.freeTextSearchOperand,
            '',
        );
    }

    public getDateTimeFormattedForSearch(dateString: string): string {
        // 03/21/2017 15:03:00 -> "2017-11-11T14:04:24.000Z"
        return moment(dateString, Constants.MOMENT_FORM_DATETIME_FORMAT).format(Constants.MOMENT_API_DATETIME_FORMAT);
    }

    public getTimeFormattedForSearch(timeString: string): string {
        // 15:03:00 -> 15:03:00Z
        return moment(timeString, Constants.MOMENT_FORM_TIME_FORMAT).format(Constants.MOMENT_API_TIME_FORMAT);
    }
}

export interface XQueryConfigType {
    entity?: Entity;  // we're putting the any here so we can unit test with mock data
    attribute?: Attribute;
    operation?: Operation;
    operand?: string;
    freeTextSearchOperand?: string;
    searchStacks?: Array<SearchStack>;
    entityList?: Array<Entity>;
};

export class SearchOrganizer {
    public entity: Entity;
    public attributeOrganizerList: Array<AttributeOrganizer>;
    public freeTextSearchOperand?: string;

    public static buildSearchOrganizer(searchStack: SearchStack): SearchOrganizer {
        const searchOrganizer = new SearchOrganizer();
        const attributeOrganizerList = new Array<AttributeOrganizer>();
        const attributeSearchOrganizer = new AttributeOrganizer();

        searchOrganizer.entity = searchStack.entity;
        searchOrganizer.freeTextSearchOperand = searchStack.freeTextSearchOperand;

        attributeSearchOrganizer.attribute = searchStack.attribute;
        attributeSearchOrganizer.operand = searchStack.operand;
        attributeSearchOrganizer.operationType = searchStack.operation ? searchStack.operation.operationType : null;

        attributeOrganizerList.push(attributeSearchOrganizer);
        searchOrganizer.attributeOrganizerList = attributeOrganizerList;
        return searchOrganizer;
    }
}

export class AttributeOrganizer {
    public attribute: Attribute;
    public operationType: OperationType;
    public operand?: string;

    public static buildAttributeOrganizer(searchStack: SearchStack): AttributeOrganizer {
        const attributeSearchSummary = new AttributeOrganizer();
        attributeSearchSummary.attribute = searchStack.attribute;
        attributeSearchSummary.operand = searchStack.operand;
        attributeSearchSummary.operationType = searchStack.operation ? searchStack.operation.operationType : null;
        return attributeSearchSummary;
    }
}
