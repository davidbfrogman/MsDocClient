import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { TestingModule } from 'testing';
import { SearchStackComponent } from './search-stack.component';
import { SearchOperationFactory } from '../search-operation-factory';
import { EntityService } from 'services';
import { SearchStackEventBus } from 'event-buses';
import { SearchStack, Entity } from 'models';
import { OperationType } from 'enumerations';

describe('SearchStackComponent', () => {
  let component: SearchStackComponent;
  let fixture: ComponentFixture<SearchStackComponent>;
  let searchStackEventBus: SearchStackEventBus;
  let searchStackForTesting: SearchStack;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    });
    fixture = TestBed.createComponent(SearchStackComponent);
    component = fixture.componentInstance;
    const mockEntityService = fixture.debugElement.injector.get(EntityService);
    searchStackEventBus = fixture.debugElement.injector.get(SearchStackEventBus);

    mockEntityService.getList().subscribe((entities: Entity[]) => {
      // Build a search stack to use for testing
      searchStackForTesting = new SearchStack(
        entities[0], entities[0].attrs.attr[0],
        new SearchOperationFactory().findOperationByType(OperationType.EqualTo),
        'DBOperand', 'FreeTextOperand Testing', 'Draft'
      );
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should put a search stack on the event bus when editing', async(() => {
    searchStackEventBus.searchStackEdited$.subscribe((searchStack) => {
      expect(searchStack).toBeTruthy();
      expect(searchStack.attribute).toBe(searchStackForTesting.attribute);
      expect(searchStack.entity).toBe(searchStackForTesting.entity);
      expect(searchStack.freeTextSearchOperand).toBe(searchStackForTesting.freeTextSearchOperand);
      expect(searchStack.operand).toBe(searchStackForTesting.operand);
      expect(searchStack.operandName).toBe(searchStackForTesting.operandName);
      expect(searchStack.operation).toBe(searchStackForTesting.operation);
    });

    component.onEditStack(searchStackForTesting);
  }));

  it('should remove a search stack when deleting', async(() => {
    searchStackEventBus.searchStackDeleted$.subscribe((searchStack) => {
      expect(searchStack).toBeTruthy();
      expect(searchStack.attribute).toBe(searchStackForTesting.attribute);
      expect(searchStack.entity).toBe(searchStackForTesting.entity);
      expect(searchStack.freeTextSearchOperand).toBe(searchStackForTesting.freeTextSearchOperand);
      expect(searchStack.operand).toBe(searchStackForTesting.operand);
      expect(searchStack.operandName).toBe(searchStackForTesting.operandName);
      expect(searchStack.operation).toBe(searchStackForTesting.operation);
      expect(searchStackEventBus.searchStacks).toBeTruthy();
      expect(searchStackEventBus.searchStacks.length).toBe(0);
    });

    searchStackEventBus.addSearchStack(searchStackForTesting);
    component.onDeleteStack(searchStackForTesting);
  }));

});
