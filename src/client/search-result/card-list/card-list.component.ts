import { Component, Input, ViewChild } from '@angular/core';
import { SohoListViewComponent } from '@infor/sohoxi-angular';
import { Item } from 'models';
import { ItemUtility, ActionUtility } from 'utility';
import { ActionViewsType, ActionsType } from 'enumerations';
import { SelectedItemsEventBus, ActionEventBus, ItemTabsEventBus, XQueryEventBus } from 'event-buses';

@Component({
  selector: 'idm-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent {
  public actionViewsType = ActionViewsType; // Added to use the enums in the html
  @Input() items: Item[];
  @ViewChild(SohoListViewComponent) sohoListView: SohoListViewComponent;

  constructor(
    private actionEventBus: ActionEventBus,
    private selectedItemsEventBus: SelectedItemsEventBus,
    private itemTabsEventBus: ItemTabsEventBus,
    private xQueryEventBus: XQueryEventBus
  ) {
    // We need to reset items to let SOHO listview know
    // that the stack has changed
    this.xQueryEventBus.xQueryChanged$.subscribe(() => {
      this.items.length = 0;
    });
  }

  onSelected(event: any) {
    const uniqueId = event[1].elem[0].id;
    const item: Item = ItemUtility.getItemByUniqueId(this.items, uniqueId);
    this.selectedItemsEventBus.toggle(item);
  }

  private isActionMenuVisible(): boolean {
    return (this.selectedItemsEventBus.items.length > 0);
  }

  openItem(item: Item) {
    this.itemTabsEventBus.open(item);
    this.actionEventBus.triggerAction(ActionUtility.createNewAction(ActionsType.Display, [item]));
  }

  getDisplayName(item: Item): string {
    return ItemUtility.getDisplayName(item);
  }

  public isItemSelected(item: Item) {
    return (this.selectedItemsEventBus.get(item.uniqueId) !== null);
  }
}
