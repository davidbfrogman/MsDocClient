import { Injectable } from '@angular/core';
import * as moment from "moment";
import { Constants } from '../../constants';
import { OperationType, AttributeType } from 'enumerations';
import { Attribute, Entity, Operation, SearchStack } from 'models';
import { AttributeUtility } from 'utility';


@Injectable()
export class XQueryBuilder {
    protected entity: Entity = null;
    protected attribute: Attribute = null;
    protected operation: Operation = null;
    protected operand: string = null;
    protected freeTextSearchOperand: string = null;
    protected searchStacks = Array<SearchStack>();
    protected searchOrganizers = Array<SearchOrganizer>();

    constructor() {
        return this;
    }

    withConfig(configuration?: xQueryConfigType): XQueryBuilder {
        if (configuration === undefined) {
            this.entity = null;
            this.attribute = null;
            this.operation = null;
            return this;
        }

        //Required Properties
        this.entity = configuration.entity !== undefined && configuration.entity.attrs ? configuration.entity : null;
        this.operation = configuration.operation !== undefined ? configuration.operation: null;
        this.attribute = configuration.attribute !== undefined ? configuration.attribute: null;
        
        //Optional Arguments
        if (configuration.freeTextSearchOperand !== undefined) {
            this.freeTextSearchOperand = configuration.freeTextSearchOperand;
        }
        if (configuration.operand !== undefined) {
            this.operand = configuration.operand;
        }
        if (configuration.searchStacks !== undefined) {
            //I'm going to modify the search stack array that's passed in so we want to create a copy.
            this.searchStacks = configuration.searchStacks.slice(0);
        }

        return this;
    }

    build() {
        const xQueryParts: Array<string> = [];
        let xQuerySearchOrgParts: Array<string> = [];
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
        // /Customer[@CHECKEDOUTUSERID = "niclas.vestlund@infor.com"] UNION /MDS_GenericDocument[@MDS_AccountingEntity = "accentity" AND @RESOURCENAME = "test"] UNION /EAM[@RESOURCENAME = "new"]
        // (/MDS_File[@displayName = "asdf" AND @RESOURCESIZE = "22"] UNION /Customer[@RESOURCESIZE = "22"]) INTERSECT CONTAINS(/Customer|/MDS_File, "456")

        this.searchOrganizers.forEach((so,soIndex) => {
            xQuerySearchOrgParts = [];
            if (so.entity) {
                xQuerySearchOrgParts.push(`/${so.entity.name}`);
            }
            so.attributeOrganizerList.forEach((ao,aoIndex) => {
                if (ao && ao.attribute && ao.operationType && ao.attribute.name && ao.attribute.name.length > 0) {
                    AttributeUtility.mapAttributeTypeEnumeration(ao.attribute);

                    if(aoIndex === 0){
                        xQuerySearchOrgParts.push(`[`);
                    }

                    if (!ao.attribute.isMultiValue) {
                        xQuerySearchOrgParts.push(`@${ao.attribute.qual}`);
                    }
                    else {
                        //"DavesMVAttribute/Value" --> DavesMVAttribute/@Value
                        let mvName = ao.attribute.qual;
                        mvName = mvName.replace(`/`, `/@`);
                        xQuerySearchOrgParts.push(`${mvName}`);
                    }

                    //If someone passed in null for the string operand, we want to search on empty string.
                    if (ao.operand == null) {
                        ao.operand = '';
                    }

                    //We change the formatting for searching.
                    if (ao.attribute.attributeType == AttributeType.Timestamp) {
                        ao.operand = this.getDateFormattedForSearch(ao.operand);
                    }

                    if (ao.attribute.attributeType == AttributeType.Time) {
                        ao.operand = this.getTimeFormattedForSearch(ao.operand);
                    }

                    // Build out the operation, and operand
                    switch (ao.operationType) {
                        case OperationType.NotEqual:
                            xQuerySearchOrgParts.push(` != "${ao.operand}"`);
                            break;
                        case OperationType.EqualTo:
                            xQuerySearchOrgParts.push(` = "${ao.operand}"`);
                            break;
                        case OperationType.Like:
                            xQuerySearchOrgParts.push(` LIKE "${ao.operand}"`);
                            break;
                        case OperationType.NotLike:
                            xQuerySearchOrgParts.push(` NOT LIKE "${ao.operand}"`);
                            break;
                        case OperationType.True:
                            xQuerySearchOrgParts.push(` = true`);
                            break;
                        case OperationType.False:
                            xQuerySearchOrgParts.push(` = false`);
                            break;
                        case OperationType.HasValue:
                            xQuerySearchOrgParts.push(` IS NOT NULL`);
                            break;
                        case OperationType.NoValue:
                            xQuerySearchOrgParts.push(` IS NULL`);
                            break;
                        case OperationType.After:
                            xQuerySearchOrgParts.push(` > "${ao.operand}"`);
                            break;
                        case OperationType.AfterOrEqual:
                            xQuerySearchOrgParts.push(` >= "${ao.operand}"`);
                            break;
                        case OperationType.Before:
                            xQuerySearchOrgParts.push(` < "${ao.operand}"`);
                            break;
                        case OperationType.BeforeOrEqual:
                            xQuerySearchOrgParts.push(` <= "${ao.operand}"`);
                            break;
                        default:
                            break;
                    }
                    //If we're in the middle of the loop put an 'and' in place.
                    if(aoIndex !== so.attributeOrganizerList.length -1){
                        xQuerySearchOrgParts.push(` AND `)
                    }
                    //If we're at the end of the attributes we wrap them in a closing bracket.
                    if(aoIndex === so.attributeOrganizerList.length -1){
                        xQuerySearchOrgParts.push(`]`);
                    }
                }
            }); //End of loop for Attribute Search searchSummaries

            if (so.freeTextSearchOperand && so.freeTextSearchOperand.length > 0) {
                // (/WF_test[@CHECKEDOUTUSERID = "asdf"]) INTERSECT CONTAINS(/WF_test, "asdf")
                //First we need to wrap what we have built at this point in parenthesis.
                xQuerySearchOrgParts.splice(0, null, `(`);
                xQuerySearchOrgParts.push(`)`);
                xQuerySearchOrgParts.push(` INTERSECT CONTAINS(/${so.entity.name}, "${so.freeTextSearchOperand}") `);
            }
            
            //Then we wrap the whole thing
            if(soIndex != this.searchOrganizers.length -1){
                xQuerySearchOrgParts.splice(0, null, `(`);
                xQuerySearchOrgParts.push(`) `);
                xQuerySearchOrgParts.push(` UNION `)
            }
            xQueryParts.push(xQuerySearchOrgParts.join(''));
        });

        return xQueryParts.join('');
    }

    public organizeSearchSummaries() {
        if (!this.searchStacks) {
            this.searchStacks = new Array<SearchStack>();
        }
        if(this.entity){
            this.searchStacks.push(this.getSearchStackFromConfig());
        }

        this.searchStacks.forEach(searchStack => {
            // Search for an existing search summary, using entity as our 'key'
            let existingSearchSummary = this.searchOrganizers.find((searchSummary) => {
                return searchSummary.entity == searchStack.entity
            });
            // If we didn't find an existing search summary for this entity, 
            // then we need to add one.
            if (!existingSearchSummary) {
                this.searchOrganizers.push(SearchOrganizer.buildSearchOrganizer(searchStack));
            }
            //Here we found an existing search summary, so we need to add properties to it's attributes
            else {
                existingSearchSummary.attributeOrganizerList.push(AttributeOrganizer.buildAttributeOrganizer(searchStack));
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
        )
    }

    public getDateFormattedForSearch(dateString: string): string {
        //03/21/2017 15:03:00 -> "2017-11-11T14:04:24.000Z"
        let dt = moment(dateString, Constants.SOHO_DATEPICKER_DATETIME_FORMAT);
        return dt.format(Constants.MOMENT_API_DATETIME_FORMAT); //Moment uses [] for escape chars.
    }

    public getTimeFormattedForSearch(timeString: string): string {
        //15:03:00 -> 15:03:00Z
        let dt = moment(timeString, Constants.SOHO_DATEPICKER_TIME_FORMAT);
        return dt.format(Constants.MOMENT_API_TIME_FORMAT);
    }
}

export declare type xQueryConfigType = {
    entity: Entity,  //we're putting the any here so we can unit test with mock data
    attribute: Attribute,
    operation: Operation,
    operand?: string,
    freeTextSearchOperand?: string,
    searchStacks?: Array<SearchStack>,
};

export class SearchOrganizer {
    public entity: Entity;
    public attributeOrganizerList: Array<AttributeOrganizer>;
    public freeTextSearchOperand?: string;

    public static buildSearchOrganizer(searchStack: SearchStack): SearchOrganizer {
        let searchOrganizer = new SearchOrganizer();
        let attributeOrganizerList = new Array<AttributeOrganizer>();
        let attributeSearchOrganizer = new AttributeOrganizer();

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
        let attributeSearchSummary = new AttributeOrganizer();
        attributeSearchSummary.attribute = searchStack.attribute;
        attributeSearchSummary.operand = searchStack.operand;
        attributeSearchSummary.operationType = searchStack.operation ? searchStack.operation.operationType : null;
        return attributeSearchSummary;
    }
}
