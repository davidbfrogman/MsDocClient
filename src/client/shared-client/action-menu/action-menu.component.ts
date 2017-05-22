import { Component, Input, OnChanges } from '@angular/core';
import { SohoToolbarModule } from '@infor/sohoxi-angular';
import { SohoIconModule } from '@infor/sohoxi-angular';
import { Item, ActionButton, Action, Configuration } from 'models';
import { ActionEventBus, SelectedItemsEventBus, ItemTabsEventBus, ErrorEventBus, ConfigurationEventBus } from 'event-buses';
import { ActionsType, ActionViewsType } from 'enumerations';
import { ItemUtility, ActionUtility, ActionButtonUtility } from 'utility';
import { ItemService } from 'services';
import { Constants } from '../../../constants';

@Component({
  selector: 'idm-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss'],
})

export class ActionMenuComponent implements OnChanges {
  @Input() item: Item;
  @Input() actionView: ActionViewsType = ActionViewsType.SearchResult;
  public actionButtons: ActionButton[] = [];
  private selectedItems: Item[];
  public showButtonTitle: boolean;
  public buttonType: string;
  private currentUser;

  public actions = ActionsType; // Added to use the enums in the html
  public actionsViewType = ActionViewsType; // Added to use the enums in the html

  constructor(public actionEventBus: ActionEventBus, private selectedItemsEventBus: SelectedItemsEventBus,
    private itemTabsEventBus: ItemTabsEventBus, private itemService: ItemService, private errorEventBus: ErrorEventBus,
    private configurationEventBus: ConfigurationEventBus) {
    this.subscribeToSelectedItemsChanged();
    this.currentUser = configurationEventBus.getConfiguration(Constants.PROP_CONNECTION_USERNAME);
  }

  protected subscribeToSelectedItemsChanged() {
    this.selectedItemsEventBus.selectedItemsChanged$.subscribe((selectedItems) => {
      if (!this.item) {
        this.selectedItems = null;
        this.selectedItems = this.selectedItemsEventBus.selectedItems;
        if (!this.actionButtons || this.actionButtons.length < 1) {
          this.actionButtons = ActionButtonUtility.getActionButtons(this.actionView, 'list');
        }
        this.updateButtonVisability();
      }
    });
  }

  ngOnChanges() {
    this.setViewSpecificValues();
    this.setItemAsSelectedItem(this.item);
    if (!this.actionButtons || this.actionButtons.length < 1 && this.item) {
      this.actionButtons = ActionButtonUtility.getActionButtons(this.actionView, this.item.entityName + '-' + this.item.id);
    }
    this.updateButtonVisability();
  }

  private setItemAsSelectedItem(item: Item): void {
    if (this.item) {
      this.selectedItems = null;
      this.selectedItems = [item];
    }
  }

  public isVisible(): boolean {
    if (this.selectedItems && this.selectedItems.length > 0) {
      return true;
    }
    return false;
  }

  public onAction(action: ActionsType): void {
    switch (action) {
      case ActionsType.Display:
        this.onActionDisplay();
        break;
      case ActionsType.Save:
        this.onActionSave();
        break;
      case ActionsType.CheckOut:
        this.onActionCheckOut();
        break;
      case ActionsType.CheckIn:
        this.onActionCheckIn();
        break;
      case ActionsType.DiscardCheckOut:
        this.onActionDiscardCheckOut();
        break;
      default:
        break;
    }
  }

  private onActionDisplay(): void {
    this.selectedItems.forEach(item => {
      this.itemTabsEventBus.openItemTab(item);
      this.actionEventBus.triggerAction(
        ActionUtility.createNewAction(ActionsType.Display, this.selectedItems));
    });
  }

  private onActionSave(): void {
    if (this.item.pid) { // Update
      this.itemService.update(this.item, this.item.pid, { checkout: false }).subscribe(resultItem => {
        this.item = resultItem;
        this.actionEventBus.triggerAction(
          ActionUtility.createNewAction(ActionsType.Save, this.selectedItems));
      }, error => {
        this.errorEventBus.throw(error);
      });
    } else if (this.item) { // Create new
      this.itemService.create(this.item).subscribe(resultItem => {
        this.item = resultItem;
        this.actionEventBus.triggerAction(
          ActionUtility.createNewAction(ActionsType.Save, this.selectedItems));
      }, error => {
        this.errorEventBus.throw(error);
      });
    }
  }

  private onActionCheckOut(): void {
    if (this.selectedItems) {
      // TODO: use batch operations
      this.selectedItems.forEach(item => {
        if (!ItemUtility.isCheckedOut(item)) {
          this.itemService.checkOut(item.pid).subscribe((resultItem: Item) => {
            this.updateAfterAction(ActionsType.DiscardCheckOut, item, resultItem);
          }, error => {
            this.errorEventBus.throw(error);
          });
        }
      });
    }
  }

  private onActionCheckIn(): void {
    if (this.selectedItems) {
      // TODO: use batch operations
      this.selectedItems.forEach(item => {
        if (ItemUtility.isCheckedOut(item)) {
          this.itemService.checkIn(item.pid).subscribe((resultItem: Item) => {
            this.updateAfterAction(ActionsType.DiscardCheckOut, item, resultItem);
          }, error => {
            this.errorEventBus.throw(error);
          });
        }
      });
    }
  }

  private onActionDiscardCheckOut(): void {
    if (this.selectedItems) {
      // TODO: use batch operations
      this.selectedItems.forEach(item => {
        if (ItemUtility.isCheckedOut(item)) {
          this.itemService.undoCheckOut(item.pid).subscribe((resultItem: Item) => {
            this.updateAfterAction(ActionsType.DiscardCheckOut, item, resultItem);
          }, error => {
            this.errorEventBus.throw(error);
          });
        }
      });
    }
  }

  private updateAfterAction(action: ActionsType, itemBefore: Item,  itemAfter: Item) {
    this.actionEventBus.triggerAction(ActionUtility.createNewAction(action, [itemAfter]));
    this.selectedItemsEventBus.updateSelectedItem(itemAfter);
  }

  public setViewSpecificValues(): void {
    if (this.actionView === ActionViewsType.Details) {
      this.showButtonTitle = true; // 'tertiary'
      this.buttonType = 'tertiary';
    } else {
      this.showButtonTitle = false;
      this.buttonType = 'icon';
    }
  }

  private updateButtonVisability(): void {
    if (this.selectedItems && this.selectedItems.length > 0) {
      this.toggleSaveEnablement();
      this.toggleDiscardCheckoutVisability();
      this.toggleCheckinCheckoutButtonsVisability();
    }
  }

  private changeSingleButtonVisability(actionButtons: ActionButton[], action: ActionsType, visible: boolean): void {
    actionButtons.forEach(button => {
      if (button.action === action) {
        button.visible = visible;
      }
    });
  }

  private changeSingleButtonEnable(actionButtons: ActionButton[], action: ActionsType, enabled: boolean): void {
    actionButtons.forEach(button => {
      if (button.action === action) {
        button.enabled = enabled;
      }
    });
  }

  private toggleSaveEnablement(): void {
    if (this.selectedItems && this.selectedItems.length === 1) {
      if (this.selectedItems[0].checkedOutBy || !this.selectedItems[0].createdTimestamp) { // TODO: Change to use isDirty flag
        this.changeSingleButtonEnable(this.actionButtons, ActionsType.Save, true);
      } else {
        this.changeSingleButtonEnable(this.actionButtons, ActionsType.Save, false);
      }
    }
  }
  private toggleDiscardCheckoutVisability(): void {
    let showDiscardCheckoutButton = false;

    // Check if there is some document checked out
    this.selectedItems.forEach(item => {
      if (ItemUtility.isCheckedOut(item)) {
        showDiscardCheckoutButton = true;
      }
    });
    if (showDiscardCheckoutButton) {
      this.changeSingleButtonVisability(this.actionButtons, ActionsType.DiscardCheckOut, true);
    } else {
      this.changeSingleButtonVisability(this.actionButtons, ActionsType.DiscardCheckOut, false);
    }
  }
  private toggleCheckinCheckoutButtonsVisability(): void {
    let showCheckinSet, showCheckoutSet = false;

    this.selectedItems.forEach(item => {
      // CheckIn is shown only if document is checked out by current user
      if (item.checkedOutBy === this.currentUser && !showCheckinSet) {
        this.changeSingleButtonVisability(this.actionButtons, ActionsType.CheckIn, true);
        showCheckinSet = true;
      }
      // CheckOut is shown only if document is not checked out
      if (!item.checkedOutBy && !showCheckoutSet) {
        this.changeSingleButtonVisability(this.actionButtons, ActionsType.CheckOut, true);
        showCheckoutSet = true;
      }
    });
    if (!showCheckinSet) {
      this.changeSingleButtonVisability(this.actionButtons, ActionsType.CheckIn, false);
    }
    if (!showCheckoutSet) {
      this.changeSingleButtonVisability(this.actionButtons, ActionsType.CheckOut, false);
    }
  }
}
