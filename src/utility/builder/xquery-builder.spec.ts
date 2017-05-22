import { } from 'jasmine';
import { environment } from '../../environments/environment';
import { TestBed, async } from '@angular/core/testing';
import { XQueryBuilder, xQueryConfigType } from './xquery-builder';
import { EntitiesWithAttributes } from '../../services/mock/mock-data/entities-with-attributes.data';
import { SearchOperationFactory } from "client/search/search-operation-factory";
import { OperationType } from "enumerations";
import { Entity, Operation, Attribute, SearchStack } from "models";
import { EntityUtility } from "utility";

describe('xQueryBuilder', () => {

  let mvEntity: Entity = Object.assign(new Entity(), EntitiesWithAttributes.entities.entity[2]);
  let mdsGenericDocument: Entity = Object.assign(new Entity(), EntitiesWithAttributes.entities.entity[0]);
  const defaultAttributeIndex = 1; //This will allow us to find this attribute later in tests
  let searchStackForTesting = new SearchStack(
    mvEntity,
    mvEntity.attrs.attr[defaultAttributeIndex],
    new SearchOperationFactory().findOperationByType(OperationType.EqualTo),
    "searchStack Test",
    "searchStack FTS",
    null
  );
  let searchStacksArray = new Array<SearchStack>();

  beforeAll(() => {
    searchStacksArray.push(searchStackForTesting);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  //patern = /entityNameWithUnderscores
  it('build an xquery when theres only a document set in the config', async(() => {
    let queryBuilder = new XQueryBuilder().withConfig({
      entity: mvEntity,
      attribute: undefined,
      operation: undefined
    })

    const xQueryTemplate = `/${mvEntity.name}`;
    expect(xQueryTemplate).toEqual(queryBuilder.build());
  }));

  // pattern = /entityNameWithUnderscores[@attribute = ""]
  it('build an xquery with an equal sign and an attribute', async(() => {
    let queryBuilder = new XQueryBuilder().withConfig({
      entity: mvEntity,
      attribute: mvEntity.attrs.attr[defaultAttributeIndex],
      operation: new SearchOperationFactory().findOperationByType(OperationType.EqualTo),
      operand: "test"
    })

    const xQueryTemplate = `/${mvEntity.name}[@${mvEntity.attrs.attr[1].name} = "test"]`;
    expect(xQueryTemplate).toEqual(queryBuilder.build());
  }));

  // pattern = /entityNameWithUnderscores[@attribute != ""]
  it('build an xquery with an not equal sign and an attribute', async(() => {
    let queryBuilder = new XQueryBuilder().withConfig({
      entity: mvEntity,
      attribute: mvEntity.attrs.attr[defaultAttributeIndex],
      operation: new SearchOperationFactory().findOperationByType(OperationType.NotEqual),
      operand: "test"
    })

    const xQueryTemplate = `/${mvEntity.name}[@${mvEntity.attrs.attr[defaultAttributeIndex].name} != "test"]`;
    expect(xQueryTemplate).toEqual(queryBuilder.build());
  }));

  // pattern = /entityNameWithUnderscores[@ValuesetAttribute = "IMAGE"]
  it('build an xquery with value set attribute', async(() => {
    let attributeIndex = 11;
    let queryBuilder = new XQueryBuilder().withConfig({
      entity: mvEntity,
      attribute: mvEntity.attrs.attr[attributeIndex], //Which is a value set attribute and 0 = draft
      operation: new SearchOperationFactory().findOperationByType(OperationType.EqualTo),
      operand: "Draft",
    })

    const xQueryTemplate = `/${mvEntity.name}[@${mvEntity.attrs.attr[attributeIndex].name} = "Draft"]`;
    expect(xQueryTemplate).toEqual(queryBuilder.build());
  }));

  // pattern = /entityNameWithUnderscores[@DateAttribute = "2017-03-07T02:04:05.000Z"]
  it('format an attribute of date type correctly', async(() => {
    let attributeIndex = 4;
    let queryBuilder = new XQueryBuilder().withConfig({
      entity: mvEntity,
      attribute: mvEntity.attrs.attr[attributeIndex], //Which is a value set attribute and 0 = draft
      operation: new SearchOperationFactory().findOperationByType(OperationType.EqualTo),
      operand: '2017-04-06T09:04:46.000Z',
    })

    const xQueryTemplate = `/${mvEntity.name}[@${mvEntity.attrs.attr[attributeIndex].name} = "2017-04-06T09:04:46.000Z"]`;
    expect(xQueryTemplate).toEqual(queryBuilder.build());
  }));

  // /WF_test[@CHECKEDOUTTS = "2017-11-11T14:04:24.000Z"]) 
  it('Should Work with a standard attribute/property like Size + Convert to resource size', async(() => {
    mvEntity = EntityUtility.BuildComprehensiveAttributes(mvEntity);
    let queryBuilder = new XQueryBuilder().withConfig({
      entity: mvEntity,
      attribute: mvEntity.comprehensiveAttributes.find((value: Attribute) => {
        return value.name == "Size";
      }), //Which is a value set attribute and 0 = draft
      operation: new SearchOperationFactory().findOperationByType(OperationType.EqualTo),
      operand: '10',
    })

    const xQueryTemplate = `/${mvEntity.name}[@RESOURCESIZE = "10"]`;
    expect(xQueryTemplate).toEqual(queryBuilder.build());
  }));

  // (/WF_test[@CHECKEDOUTUSERID = "asdf"]) INTERSECT CONTAINS(/WF_test, "asdf")
  it('build an xQuery when we have a free text search operand', async(() => {
    mvEntity = EntityUtility.BuildComprehensiveAttributes(mvEntity);
    let queryBuilder = new XQueryBuilder().withConfig({
      entity: mvEntity,
      attribute: mvEntity.comprehensiveAttributes.find((value: Attribute) => {
        return value.name == "Size";
      }), //Which is a value set attribute and 0 = draft
      operation: new SearchOperationFactory().findOperationByType(OperationType.EqualTo),
      operand: '10',
      freeTextSearchOperand: "test"
    })

    const xQueryTemplate = `(/${mvEntity.name}[@RESOURCESIZE = "10"]) INTERSECT CONTAINS(/${mvEntity.name}, "test")`;
    // I don't really care about spacing in the test.
    expect(xQueryTemplate.replace(/\s+/g, '')).toEqual(queryBuilder.build().replace(/\s+/g, ''));
  }));

  it(`Use 'AND' When we have 2 attributes for the same document type`, async(() => {
    mvEntity = EntityUtility.BuildComprehensiveAttributes(mvEntity);
    let queryBuilder = new XQueryBuilder().withConfig({
      entity: mvEntity,
      attribute: mvEntity.comprehensiveAttributes.find((value: Attribute) => {
        return value.name == "Size";
      }),
      operation: new SearchOperationFactory().findOperationByType(OperationType.EqualTo),
      operand: '10X',
      freeTextSearchOperand: "test",
      searchStacks: searchStacksArray
    })

    const xQueryTemplate = `(/${mvEntity.name}[@${mvEntity.attrs.attr[defaultAttributeIndex].name} = "${searchStacksArray[0].operand}" AND @RESOURCESIZE = "10X"]) INTERSECT CONTAINS(/${mvEntity.name}, "searchStack FTS")`;
    // I don't really care about spacing in the test.
    expect(xQueryTemplate.replace(/\s+/g, '')).toEqual(queryBuilder.build().replace(/\s+/g, ''));
  }));

  it(`Use 'UNION' When we have 2 document types`, async(() => {
    mdsGenericDocument = EntityUtility.BuildComprehensiveAttributes(mdsGenericDocument);
    searchStacksArray[0].freeTextSearchOperand = null;
    let queryBuilder = new XQueryBuilder().withConfig({
      entity: mdsGenericDocument,
      attribute: mdsGenericDocument.comprehensiveAttributes.find((value: Attribute) => {
        return value.name == "Size";
      }),
      operation: new SearchOperationFactory().findOperationByType(OperationType.EqualTo),
      operand: '10X',
      freeTextSearchOperand: null,
      searchStacks: searchStacksArray
    })

    const xQueryTemplate = `(/${mvEntity.name}[@${mvEntity.attrs.attr[defaultAttributeIndex].name} = "${searchStacksArray[0].operand}"])  UNION /${mdsGenericDocument.name}[@RESOURCESIZE = "10X"]`;
    // I don't really care about spacing in the test.
    expect(xQueryTemplate.replace(/\s+/g, '')).toEqual(queryBuilder.build().replace(/\s+/g, ''));
  }));
});
