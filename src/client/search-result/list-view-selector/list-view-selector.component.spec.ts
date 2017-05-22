import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { TestingModule } from 'testing';
import { SearchResultListViewsType } from 'enumerations';
import { ListViewSelectorComponent } from './list-view-selector.component';
import { ViewSelectorEventBus } from 'event-buses';

describe('ListViewSelectorComponent', () => {
  let component: ListViewSelectorComponent;
  let fixture: ComponentFixture<ListViewSelectorComponent>;
  let viewSelectorEventBus: ViewSelectorEventBus;

  beforeAll(() => {
     TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    });
    fixture = TestBed.createComponent(ListViewSelectorComponent);
    component = fixture.componentInstance;
    viewSelectorEventBus = fixture.debugElement.injector.get(ViewSelectorEventBus);
  });

  it(`should create the component`, async(() => {
    expect(component).toBeTruthy();
  }));

  // Test @outputs
  it('viewSelectorEventBus should have SearchResultListViews.Card when card button is clicked', () => {
    component.onCardListSelected();
    // Then
    expect(viewSelectorEventBus.selectedSearchResultView === SearchResultListViewsType.Card).toBe(true);
    expect(viewSelectorEventBus.selectedSearchResultView === SearchResultListViewsType.Thumbnail).toBe(false);
    expect(viewSelectorEventBus.selectedSearchResultView === SearchResultListViewsType.Detail).toBe(false);
  });

  // Test @outputs
  it('viewSelectorEventBus should have SearchResultListViews.Thumbnail when thumbnail button is clicked', () => {
    component.onThumbnailListSelected();
    // Then
    expect(viewSelectorEventBus.selectedSearchResultView === SearchResultListViewsType.Card).toBe(false);
    expect(viewSelectorEventBus.selectedSearchResultView === SearchResultListViewsType.Thumbnail).toBe(true);
    expect(viewSelectorEventBus.selectedSearchResultView === SearchResultListViewsType.Detail).toBe(false);
  });

  // Test @outputs
  it('viewSelectorEventBus should have SearchResultListViews.Detail when detail button is clicked', () => {
    component.onDetailListSelected();
    // Then
    expect(viewSelectorEventBus.selectedSearchResultView === SearchResultListViewsType.Card).toBeFalsy();
    expect(viewSelectorEventBus.selectedSearchResultView === SearchResultListViewsType.Thumbnail).toBeFalsy();
    expect(viewSelectorEventBus.selectedSearchResultView === SearchResultListViewsType.Detail).toBeTruthy();
  });

});
