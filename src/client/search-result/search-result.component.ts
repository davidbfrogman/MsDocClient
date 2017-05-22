import { Component, Input, ViewChild } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {  SohoTextAreaComponent} from '@infor/sohoxi-angular';
import { ListViewSelectorComponent } from './list-view-selector/list-view-selector.component';
import { XQueryEventBus, ErrorEventBus, ViewSelectorEventBus, ActionEventBus } from 'event-buses';
import { Item } from '../../models';
import { ItemService } from '../../services';
import { SearchResultListViewsType, ActionsType } from 'enumerations';
import { ItemUtility } from 'utility';

@Component({
  selector: 'idm-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})

export class SearchResultComponent {
  public itemsList: Item[];
  public xQuery: string;
  public searchResultListViews = SearchResultListViewsType; // Added to use the SearchResultListViews enum in the html

  @ViewChild(SohoTextAreaComponent) textarea: SohoTextAreaComponent;

  constructor(private itemService: ItemService, private xQueryEventBus: XQueryEventBus, private errorEventBus: ErrorEventBus,
    private viewSelectorEventBus: ViewSelectorEventBus, public actionEventBus: ActionEventBus) {
    this.subscribeToxQueryChangedEvent();
    this.subscribeToActionChangedEvent();
  }

  protected subscribeToxQueryChangedEvent() {
    this.xQueryEventBus.xQueryChanged$.subscribe((xQuery) => {
      this.xQuery = xQuery;
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
                this.updateItems(action.affectedItems, this.itemsList);
              break;
          default:
          break;
      }
    });
  }

  private updateItems(changedItems: Item[], itemsList: Item[]) {
    const newItemList: Item[] = new Array<Item>();
    itemsList.forEach(item => {
      changedItems.forEach(changedItem => {
        if (ItemUtility.isTheSameItem(item, changedItem)) {
          item = changedItem;
        }
      });
      newItemList.push(item);
    });
    this.itemsList = newItemList;
  }
  
  private search(): void {
    if(this.xQuery.length > 0) {
      this.itemService.search(this.xQuery, 0, 10).subscribe((items: Item[]) => { // TODO: How do we get limit from grid and pagination stuff
        this.itemsList = items['item'];
      }, error => {
        this.errorEventBus.throw(error);
      });
    }
  }
}
