import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Item, Action } from 'models';
import { ItemUtility, ActionUtility } from 'utility';
import { ActionViewsType, ActionsType } from 'enumerations';
import { SelectedItemsEventBus, ActionEventBus, ItemTabsEventBus } from 'event-buses';
@Component({
  selector: 'idm-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent {
  public actionViewsType = ActionViewsType; // Added to use the enums in the html

  @Input() items: Item[];

  constructor(
    private actionEventBus: ActionEventBus,
    private selectedItemsEventBus: SelectedItemsEventBus,
    private itemTabsEventBus: ItemTabsEventBus
  ) { }

  onSelected(event: any) {
    const selectedItemPid = event[1].elem[0].id;
    const indexOfSelectedItem = this.items.findIndex((item) => {
      return item.pid === selectedItemPid;
    });
    this.selectedItemsEventBus.toggleSelectItem(this.items[indexOfSelectedItem]);
  }
  private isActionMenuVisible(): boolean {
    return (this.selectedItemsEventBus.selectedItems && this.selectedItemsEventBus.selectedItems.length > 0);
  }

  trackItems(index, item) { // todo: should we use this?
    return item.pid;
  }

  openItem(item: Item) {
    this.itemTabsEventBus.openItemTab(item);
    this.actionEventBus.triggerAction(ActionUtility.createNewAction(ActionsType.Display, [item]));
  }

  getDisplayName(item: Item): string {
    return ItemUtility.getDisplayName(item);
  }
}
