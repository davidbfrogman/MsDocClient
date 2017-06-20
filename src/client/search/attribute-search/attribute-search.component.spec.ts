import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { TestingModule } from 'testing';

import { AttributeSearchComponent } from 'client/search/attribute-search/attribute-search.component';
import { UserService, EntityService } from 'services';
import { SearchStack, Entity, Attribute } from 'models';
import { SearchOperationFactory } from 'client/search/search-operation-factory';
import { OperationType, AttributeType } from 'enumerations';

describe('AttributeSearchComponent', () => {
  let component: AttributeSearchComponent;
  let fixture: ComponentFixture<AttributeSearchComponent>;
  let entityService: EntityService;
  let userService: UserService;
  let searchStackForTesting: SearchStack;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    });

    fixture = TestBed.createComponent(AttributeSearchComponent);
    component = fixture.componentInstance;
    entityService = fixture.debugElement.injector.get(EntityService);
    userService = fixture.debugElement.injector.get(UserService);

    // We need to set the debounce timing to 0, because we want our tests to be fast.
    component.userSearchDebounceTiming = 0;
    component.initializeTypeAheadUserSearching();

    entityService.getList().subscribe((entities: Entity[]) => {
      const entityList = entities; // Get Some entities
      if (entityList && entityList.length > 0) {
        // Build a search stack to use for testing
        searchStackForTesting = new SearchStack(
          entityList[0], entityList[0].attrs.attr[0],
          new SearchOperationFactory().findOperationByType(OperationType.EqualTo),
          'DBOperand', 'FreeTextOperand Testing', 'Draft'
        );
      }
    });
  });

  it('should create the AttributeSearchComponent', () => {
    expect(component).toBeTruthy();
  });

  it('no content in the AttributeSearchComponent', () => {
    expect(component.xQuery).not.toBeDefined();
  });

  // Test that the component loads a list of entities
  it('should call the api to get entities', fakeAsync(() => {
    spyOn(entityService, 'getList').and.callThrough();
    component.populateEntitiesList();
    tick();
    expect(entityService.getList).toHaveBeenCalled();
    expect(entityService.getList).toHaveBeenCalledTimes(1);
  }));

  it('should populate the entities list', fakeAsync(() => {
    spyOn(entityService, 'getList').and.callThrough();
    component.populateEntitiesList();
    tick();
    expect(component.entityList).toBeTruthy();
    expect(component.entityList.length).toBeGreaterThan(0);
  }));

  it('when I click the edit button in search stack component, the values are set correctly in the attribute search componet', () => {
    component.searchStackEventBus.searchStackEdited$.subscribe((searchStack) => {
      expect(component.selectedEntity).toEqual(searchStackForTesting.entity);
      expect(component.selectedOperation).toEqual(searchStackForTesting.operation);
      expect(component.selectedAttribute).toEqual(searchStackForTesting.attribute);
    });

    // Now that we setup our expectations, we actually push a search stack onto the bus,
    // Then we check that our component pulled it off the bus, and then pushed the properties onto the UI
    component.searchStackEventBus.editSearchStack(searchStackForTesting);
  });

  it('should populate the attributes list when an entity is selected', async(() => {
    component.populateEntitiesList();
    component.selectedEntity = component.entityList[1];
    component.onSelectedEntityChanged(component.selectedEntity);
    expect(component.attributeList).toBeTruthy();
    expect(component.attributeList.length).toBeGreaterThan(0);
  }));

  it('should populate the operator list when an attribute is selected', async(() => {
    component.populateEntitiesList();
    component.selectedEntity = component.entityList[0];
    component.onSelectedEntityChanged(component.selectedEntity);
    component.selectedAttribute = component.selectedEntity.attrs.attr[0];
    component.onSelectedAttributeChanged(component.selectedAttribute);
    expect(component.operatorList).toBeTruthy();
    expect(component.operatorList.length).toBeGreaterThan(0);
    expect(component.selectedOperation).toEqual(component.operatorList[0]);
  }));

  it('should reset all the UI controls when the selected entity is changed', async(() => {
    component.populateEntitiesList();
    component.selectedEntity = component.entityList[0];
    component.onSelectedEntityChanged(component.selectedEntity);
    component.selectedAttribute = component.selectedEntity.attrs.attr[0];
    component.onSelectedAttributeChanged(component.selectedAttribute);
    component.onSelectedEntityChanged(component.entityList[1]);
    expect(component.operatorList).toBeFalsy();
    expect(component.selectedAttribute).toBeFalsy();
  }));

  it('should build the xquery when the user hits search', async(() => {
    component.populateEntitiesList();

    // The easiest way to test this, is to use a search stack to set the UI,
    // Add the stack to the event bus, which will initalize all it's arrays;
    component.searchStackEventBus.addSearchStack(searchStackForTesting);
    // Push a stack to edit, which this component will pick up, and setup the ui for it.
    component.searchStackEventBus.editSearchStack(searchStackForTesting);

    // We didn't make any changes, but we need  to move the component, from edit mode
    // to search mode, so we can click search.
    component.onClickSaveStack();

    // Now we can click search, with a UI that has all the fields filled out.
    component.onClickSearch();

    expect(component.xQuery).toBeTruthy();
    expect(component.xQuery.length).toBeGreaterThan(0);
  }));

  it('should set the operand controls for each type of attribute', async(() => {
    component.populateEntitiesList();
    component.selectedEntity = component.entityList[2];

    component.onSelectedEntityChanged(component.selectedEntity);
    component.selectedEntity.comprehensiveAttributes.forEach(attribute => {
      component.selectedAttribute = attribute;
      component.onSelectedAttributeChanged(component.selectedAttribute);

      expect(component.operatorList).toBeTruthy();
      expect(component.operatorList.length).toBeGreaterThan(0);
      expect(component.selectedAttribute.attributeType).toBeTruthy();
      expect(component.selectedAttribute).toBeTruthy();
    });
  }));

  it('should populate the users list when user search is activated for an attribute', fakeAsync(() => {
    component.populateEntitiesList();
    component.selectedEntity = component.entityList[2];
    spyOn(userService, 'search').and.callThrough();

    component.onSelectedEntityChanged(component.selectedEntity);
    const userSearchAttribute: Attribute = component.selectedEntity.comprehensiveAttributes.find((attributeToFind) => {
      return attributeToFind.isUserForSearching === true;
    });

    component.selectedAttribute = userSearchAttribute;
    component.onSelectedAttributeChanged(userSearchAttribute);

    component.isUserSearchingActive = true;
    // Remember this search method is just returning the mock data, and not actually doing any smart searching.
    component.searchForUsers('');
    tick();
    expect(userService.search).toHaveBeenCalled();
    expect(component.usersList.length).toBeGreaterThan(0);
  }));

  it('Should retain string values on attribute change', () => {
    component.populateEntitiesList();
    component.selectedEntity = component.entityList[2];

    component.onSelectedEntityChanged(component.selectedEntity);
    component.previouslySelectedAttribute = {
      attributeType: AttributeType.String,
      name: 'Test name',
      qual: 'Test value',
      type: '1',
      value: 'Test value'
    };

    component.selectedEntity.comprehensiveAttributes.forEach(attribute => {
      component.selectedAttribute = attribute;
      component.onSelectedAttributeChanged(attribute);

      if (attribute.attributeType === AttributeType.String) {
        expect(component.selectedAttribute.value).toEqual(component.previouslySelectedAttribute.value);
      }
    });
  });

  it('Should retain number values on attribute change', () => {
    component.populateEntitiesList();
    component.selectedEntity = component.entityList[2];

    component.onSelectedEntityChanged(component.selectedEntity);
    component.previouslySelectedAttribute = {
      attributeType: AttributeType.Short,
      name: 'Test name',
      qual: 'Test value',
      type: '2',
      value: '1'
    };

    const numberTypes = [
      AttributeType.Short,
      AttributeType.Long,
      AttributeType.Decimal,
      AttributeType.Double,
      AttributeType.GUID
    ];

    component.selectedEntity.comprehensiveAttributes.forEach(attribute => {
      component.selectedAttribute = attribute;
      component.onSelectedAttributeChanged(attribute);

      if (numberTypes.indexOf(attribute.attributeType) !== -1) {
        expect(component.selectedAttribute.value).toEqual(component.previouslySelectedAttribute.value);
      }
    });
  });
});
