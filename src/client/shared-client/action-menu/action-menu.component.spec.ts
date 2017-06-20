import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { TestingModule } from 'testing';
import { ActionMenuComponent } from './action-menu.component';
import { SelectedItemsEventBus, ActionEventBus, ErrorEventBus } from 'event-buses';
import { ItemService, ItemServiceMock, BatchService } from 'services';
import { Item } from 'models';
import { ActionViewsType, ActionsType } from 'enumerations';
import { ActionUtility } from 'utility';
import { ItemsData } from 'services/mock';

describe('ActionMenuComponent', () => {
  let component: ActionMenuComponent;
  let fixture: ComponentFixture<ActionMenuComponent>;
  let selectedItemsEventBus: SelectedItemsEventBus;
  let actionEventBus: ActionEventBus;
  let errorEventBus: ErrorEventBus;
  let itemService: ItemService;
  let batchService: BatchService;
  const testItem: Item = ItemServiceMock.getMockItem();
  const testItemEmpty: Item = ItemServiceMock.getMockEmptyItem();


  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    });
    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;
    selectedItemsEventBus = TestBed.get(SelectedItemsEventBus);
    actionEventBus = TestBed.get(ActionEventBus);
    errorEventBus = fixture.debugElement.injector.get(ErrorEventBus);
    itemService = fixture.debugElement.injector.get(ItemService);
    batchService = fixture.debugElement.injector.get(BatchService);
  });

  it('should create the component', async(() => {
    expect(component).toBeTruthy();
  }));

  describe('on search result', () => {
    it('should display at least one button when item is selected', () => {
      // Given
      selectedItemsEventBus.toggle(testItem);
      component.actionView = ActionViewsType.SearchResult;
      // When
      component.ngOnChanges();
      // Then
      expect(component.actionButtons.length > 0).toBe(true);
    });

    it('should trigger display event on button click', () => {
      selectedItemsEventBus.toggle(testItem);
      component.selectedItems = selectedItemsEventBus.items;

      component.actionView = ActionViewsType.SearchResult;
      const subscription = component.actionEventBus.actionChanged$.subscribe((action) => {
        expect(action.action).toEqual(ActionsType.Display);
        expect(action.affectedItems.length === 1).toBe(true);
      });

      component.onAction(ActionsType.Display);
      subscription.unsubscribe();
    });

    it('should use batch service to check out items', () => {
      // Given
      spyOn(itemService, 'checkOut').and.callThrough();
      spyOn(batchService, 'checkOutItems').and.callThrough();
      selectedItemsEventBus.toggle(ItemsData.items.item[0]);
      selectedItemsEventBus.toggle(ItemsData.items.item[1]);
      selectedItemsEventBus.toggle(ItemsData.items.item[2]);
      component.selectedItems = selectedItemsEventBus.items;

      // When
      component.onAction(ActionsType.CheckOut);

      // Then
      expect(itemService.checkOut).toHaveBeenCalledTimes(0);
      expect(batchService.checkOutItems).toHaveBeenCalledTimes(1);
    });
  });

  describe('on document detail', () => {
    it('should display at least one button for item depending on input binding', () => {
      // Given
      component.selectedItems = [testItem];
      component.actionView = ActionViewsType.Details;
      // When
      component.ngOnChanges();
      // Then
      expect(component.actionButtons.length > 0).toBeTruthy();
    });

    it('should trigger save event on button click', () => {
      component.selectedItems = [testItem];
      component.actionView = ActionViewsType.Details;
      const subscription = component.actionEventBus.actionChanged$.subscribe((action) => {
        expect(action.action).toEqual(ActionsType.Save);
        expect(action.affectedItems.length).toBeGreaterThan(0);
      });

      component.onAction(ActionsType.Save);
      subscription.unsubscribe();
    });

    it('should trigger create event on button click', () => {
      component.selectedItems = [testItemEmpty];
      component.actionView = ActionViewsType.Details;
      const subscription = component.actionEventBus.actionChanged$.subscribe((action) => {
        expect(action.action).toEqual(ActionsType.Save);
        expect(action.affectedItems.length > 0).toBeTruthy();
      });

      component.onAction(ActionsType.Save);
      subscription.unsubscribe();
    });

    it('should have Save button disabled by default and enabled on trigger', () => {
      component.actionView = ActionViewsType.Details;
      component.actionButtons.length = 0;
      selectedItemsEventBus.toggle(testItem);
      component.selectedItems = [testItem];
      component.ngOnChanges();
      const saveButton = component.actionButtons.find(button => button.action === ActionsType.Save);

      expect(saveButton.enabled).toBeFalsy();
      component.isItemDirty = true;
      component.ngOnChanges();
      expect(saveButton.enabled).toBeTruthy();
    });

    it('should use item service to check out item', () => {
      // Given
      spyOn(itemService, 'checkOut').and.callThrough();
      spyOn(batchService, 'checkOutItems').and.callThrough();
      selectedItemsEventBus.toggle(testItem);

      // When
      component.onAction(ActionsType.CheckOut);

      // Then
      expect(itemService.checkOut).toHaveBeenCalledTimes(1);
      expect(batchService.checkOutItems).toHaveBeenCalledTimes(0);
    });
  });
});
