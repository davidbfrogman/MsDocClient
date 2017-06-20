import { Component, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SohoTextAreaComponent } from '@infor/sohoxi-angular';
import { ListViewSelectorComponent } from './list-view-selector/list-view-selector.component';
import {
  XQueryEventBus,
  ErrorEventBus,
  ViewSelectorEventBus,
  ActionEventBus,
  SelectedItemsEventBus,
  SearchStackEventBus,
  ConfigurationEventBus
} from 'event-buses';
import { ListViewPropertyComponent } from './list-view-property/list-view-property.component';
import { Item } from 'models';
import { ItemService, Translator } from 'services';
import { SearchResultListViewsType, ActionsType } from 'enumerations';
import { ItemUtility } from 'utility';
import { SearchResultsPagerComponent } from './../shared-client';
import { Constants } from './../../constants';

@Component({
  selector: 'idm-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})

export class SearchResultComponent {
  public items: Item[] = [];
  public xQuery: string;
  public searchResultListViews = SearchResultListViewsType; // Added to use the SearchResultListViews enum in the html
  public noDocumentMatch: boolean;
  public totalSearchCount: number;

  @ViewChild(SohoTextAreaComponent) textarea: SohoTextAreaComponent;
  @ViewChild(SearchResultsPagerComponent) pager: SearchResultsPagerComponent;

  constructor(
    private itemService: ItemService,
    private xQueryEventBus: XQueryEventBus,
    private errorEventBus: ErrorEventBus,
    private viewSelectorEventBus: ViewSelectorEventBus,
    public actionEventBus: ActionEventBus,
    public selectedItemsEventBus: SelectedItemsEventBus,
    private searchStackEventBus: SearchStackEventBus,
    private configurationEventBus: ConfigurationEventBus,
    public translator: Translator
  ) {
    this.subscribeToxQueryChangedEvent();
    this.subscribeToActionChangedEvent();
    this.subscribeToSearchReload();
    this.totalSearchCount = 0;
  }

  protected subscribeToxQueryChangedEvent() {
    this.xQueryEventBus.xQueryChanged$.subscribe((xQuery) => {
      this.xQuery = xQuery;
      this.pager.offset = 0;
      this.search();
    });
  }

  protected subscribeToActionChangedEvent() {
    this.actionEventBus.actionChanged$.subscribe((action) => {
      switch (action.action) {
        case ActionsType.Display:
          // Do nothing
          break;
        case ActionsType.Save:
        case ActionsType.CheckOut:
        case ActionsType.CheckIn:
        case ActionsType.DiscardCheckOut:
          this.updateItems(action.affectedItems, this.items);
          break;
        default:
          break;
      }
    });
  }

  protected subscribeToSearchReload(): void {
    this.searchStackEventBus.searchReloaded$.subscribe(this.search.bind(this));
  }

  private updateItems(changedItems: Item[], items: Item[]) {
    if (items) {
      changedItems.forEach(changedItem => {
        ItemUtility.setItem(items, changedItem);
      });
    }
  }

  private search(): void {
    const pageSize: number = this.configurationEventBus.getConfigurationAsNumber(
      Constants.SEARCH_RESULT_PAGE_SIZE, Constants.SEARCH_PAGE_SIZE);
    this.noDocumentMatch = false;
    if (this.xQuery.length > 0) {
      this.itemService.search(this.xQuery, this.pager.offset, this.pager.limit)
        .subscribe((items: any) => {
          this.items = [];
          this.totalSearchCount = parseInt(items.searchCount, 10);
          const changedItems = items.item;

          if (changedItems && changedItems.length > 0) {
            changedItems.forEach(changedItem => {
              ItemUtility.setItem(this.items, changedItem, pageSize);
            });
          } else {
            this.noDocumentMatch = true;
          }
          this.selectedItemsEventBus.clear();
        }, error => {
          this.errorEventBus.throw(error);
        });
    } else {
      this.items = [];
    }
  }
}
