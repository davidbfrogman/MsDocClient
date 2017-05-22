import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { TestingModule } from 'testing';
import { ActionMenuComponent } from './action-menu.component';
import { SelectedItemsEventBus } from 'event-buses';
import { ItemService, ItemServiceMock } from 'services';
import { Item } from 'models';
import { ActionViewsType, ActionsType } from 'enumerations';

describe('ActionMenuComponent', () => {
  let component: ActionMenuComponent;
  let fixture: ComponentFixture<ActionMenuComponent>;
  let selectedItemsEventBus: SelectedItemsEventBus;
  let mockItemService: ItemService;
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
    mockItemService = fixture.debugElement.injector.get(ItemService);
  });

  it('should create the component', async(() => {
    expect(component).toBeTruthy();
  }));

  it('action menu should be visible on item selected', () => {
    // Given
    component.actionView = ActionViewsType.SearchResult;
    // When
    selectedItemsEventBus.toggleSelectItem(testItemEmpty);
    selectedItemsEventBus.toggleSelectItem(testItem);
    // Then
    expect(component.isVisible()).toBe(true);
  });

  // State is leaked here, from the previous test, so the toggling of a selected item
  // has already been done by the previous test.  TODO: Shouldn't 'selected' just be a property on the item?
  it('action menu should not be visible on item deselected', () => {
    // Given
    component.actionView = ActionViewsType.SearchResult;
    // When
    // deselect
    selectedItemsEventBus.toggleSelectItem(testItem);
    selectedItemsEventBus.toggleSelectItem(testItemEmpty);
    // Then
    expect(component.isVisible()).toBe(false);
  });

  it('should display at least one button when item is selected', () => {
    // Given
    selectedItemsEventBus.toggleSelectItem(testItemEmpty);
    selectedItemsEventBus.toggleSelectItem(testItem);
    component.actionView = ActionViewsType.SearchResult;
    // When
    component.ngOnChanges();
    // Then
    expect(component.actionButtons.length > 0).toBe(true);
  });

  it('should trigger display event on button click', () => {

    // Given
    selectedItemsEventBus.toggleSelectItem(testItemEmpty);
    selectedItemsEventBus.toggleSelectItem(testItem);

    component.actionView = ActionViewsType.SearchResult;
    component.actionEventBus.actionChanged$.subscribe((action) => {
      expect(action.action).toEqual(ActionsType.Display);
      expect(action.affectedItems.length === 1).toBe(true);
    });

    // When
    component.onAction(ActionsType.Display);
  });

  it('action menu should be visible', () => {
    selectedItemsEventBus.toggleSelectItem(testItemEmpty);
    selectedItemsEventBus.toggleSelectItem(testItem);

    component.actionView = ActionViewsType.Details;

    expect(component.isVisible()).toBe(true);
  });

  it('should display at least one button for item depending on input binding', () => {
    // Given
    component.item = testItem;
    component.actionView = ActionViewsType.Details;
    // When
    component.ngOnChanges();
    // Then
    expect(component.actionButtons.length > 0).toBeTruthy();
  });

  it('should trigger save event on button click', () => {
    // Given
    component.item = testItem;
    component.actionView = ActionViewsType.Details;
    component.actionEventBus.actionChanged$.subscribe((action) => {
      expect(action.action).toEqual(ActionsType.Save);
      expect(action.affectedItems.length > 0).toBeTruthy();
    });

    component.onAction(ActionsType.Save);
  });

  it('should trigger create event on button click', () => {
    component.item = testItemEmpty;
    component.actionView = ActionViewsType.Details;
    component.actionEventBus.actionChanged$.subscribe((action) => {
      expect(action.action).toEqual(ActionsType.Save);
      expect(action.affectedItems.length > 0).toBeTruthy();
    });

    component.onAction(ActionsType.Save);
  });

});
