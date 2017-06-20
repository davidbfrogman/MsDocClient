import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { SohoToolbarModule } from '@infor/sohoxi-angular';
import { SohoIconModule } from '@infor/sohoxi-angular';
import { Item, ActionButton, Action, Configuration, BatchOperation, AppError } from 'models';
import { ActionEventBus, SelectedItemsEventBus, ItemTabsEventBus, ErrorEventBus, ConfigurationEventBus } from 'event-buses';
import { ActionsType, ActionViewsType } from 'enumerations';
import { ItemUtility, ActionUtility, ActionButtonUtility, BatchUtility } from 'utility';
import { ItemService, BatchService, Translator } from 'services';
import { Constants } from '../../../constants';

@Component({
  selector: 'idm-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss'],
})

export class ActionMenuComponent implements OnChanges {
  @Input() actionView: ActionViewsType = ActionViewsType.SearchResult;
  @Input() selectedItems: Item[];
  @Input() isItemDirty: boolean;
  @Output() isItemDirtyChanged:  EventEmitter<boolean> = new EventEmitter<boolean>();
  public actionButtons: ActionButton[];
  public showButtonTitle: boolean;
  public buttonType: string;
  private currentUser;

  public actions = ActionsType; // Added to use the enums in the html
  public actionsViewType = ActionViewsType; // Added to use the enums in the html

  constructor(
    public actionEventBus: ActionEventBus,
    private selectedItemsEventBus: SelectedItemsEventBus,
    private itemTabsEventBus: ItemTabsEventBus,
    private itemService: ItemService,
    private errorEventBus: ErrorEventBus,
    private configurationEventBus: ConfigurationEventBus,
    private batchService: BatchService,
    private translator: Translator
  ) {

    this.currentUser = configurationEventBus.getConfiguration(Constants.PROP_CONNECTION_USERNAME);
  }

  ngOnChanges() {
    this.setViewSpecificValues();
    // Update for Detail view
    if (!this.actionButtons || this.actionButtons.length < 1) {
      if (this.actionView === ActionViewsType.Details) {
        const item = this.selectedItems[0];
        this.actionButtons = ActionButtonUtility.getActionButtons(this.actionView, item.uniqueId);
      } else {
        this.actionButtons = ActionButtonUtility.getActionButtons(this.actionView, 'list');
      }
    }
    this.updateButtonBehaviour(this.isItemDirty);
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
    }
  }

  private onActionDisplay(): void {
    this.selectedItems.forEach(item => {
      this.itemTabsEventBus.open(item);
      this.actionEventBus.triggerAction(
        ActionUtility.createNewAction(ActionsType.Display, this.selectedItems));
    });
  }

  private onActionSave(): void {
    this.selectedItems.forEach(item => {
      if (item.pid) { // Update
        this.itemService.update(item, item.pid, { checkout: false }).subscribe(resultItem => {
          this.updateAfterAction(ActionsType.Save, resultItem);
        }, error => {
          this.errorEventBus.throw(error);
        });
      } else if (item) { // Create new
        this.itemService.create(item).subscribe(resultItem => {
          this.updateAfterAction(ActionsType.Save, resultItem, item);
        }, error => {
          this.errorEventBus.throw(error);
        });
      }
    });
  }

  private onActionCheckOut(): void {
    if (this.actionView === ActionViewsType.Details) {
      const item = this.selectedItems[0];
      this.itemService.checkOut(item.pid).subscribe((resultItem: Item) => {
        this.updateAfterAction(ActionsType.CheckOut, resultItem);
      }, error => {
        this.errorEventBus.throw(error);
      });
    } else if (this.selectedItems) {
      const currentSelectedItems = this.selectedItems.slice(); // Copy selected items
      this.batchService.checkOutItems(currentSelectedItems).subscribe(batchOperations => {
        this.handleBatchResult(currentSelectedItems, batchOperations, ActionsType.CheckOut);
      });
    }
  }

  private onActionCheckIn(): void {
    if (this.actionView === ActionViewsType.Details) {
      const item = this.selectedItems[0];
      this.itemService.checkIn(item.pid).subscribe((resultItem: Item) => {
        this.updateAfterAction(ActionsType.CheckIn, resultItem);
      }, error => {
        this.errorEventBus.throw(error);
      });
    } else if (this.selectedItems) {
      const currentSelectedItems = this.selectedItems.slice(); // Copy selected items
      this.batchService.checkInItems(currentSelectedItems).subscribe(batchOperations => {
        this.handleBatchResult(currentSelectedItems, batchOperations, ActionsType.CheckIn);
      });
    }
  }

  private onActionDiscardCheckOut(): void {
    if (this.actionView === ActionViewsType.Details) {
        const item = this.selectedItems[0];
        this.itemService.undoCheckOut(item.pid).subscribe((resultItem: Item) => {
            // Since undoCheckOut rest endpoint returns discarded item
            // We need to retrieve latest one by new retrieve request
            this.itemService.get(item.pid).subscribe((retrievedItem: Item) => {
              this.updateAfterAction(ActionsType.DiscardCheckOut, retrievedItem);
            }, error => {
              this.errorEventBus.throw(error);
            });
        }, error => {
          this.errorEventBus.throw(error);
        });
    } else if (this.selectedItems) {
      const currentSelectedItems = this.selectedItems.slice(); // Copy selected items
      this.batchService.undoCheckOutItems(currentSelectedItems).subscribe(batchOperations => {
        // Since undoCheckOut rest endpoint returns discarded item
        // We need to retrieve latest one by new retrieve request
        this.batchService.retrieveItems(currentSelectedItems).subscribe(result => {
          this.handleBatchResult(currentSelectedItems, result, ActionsType.DiscardCheckOut);
        });
      });
    }
  }

  private handleBatchResult(items: Item[], batchOperations: BatchOperation[], action: ActionsType) {
    // Handle errors in batchOperations
    if (BatchUtility.containsException(batchOperations)) {
      const error = BatchUtility.createError(items, batchOperations, this.translator);
      this.errorEventBus.throw(error);
    }

    // Update items
    for (let i = 0; i < batchOperations.length; i++) {
      if (batchOperations[i].output && batchOperations[i].output.item) {
        this.updateAfterAction(action, batchOperations[i].output.item);
      }
    }
  }

  private updateAfterAction(action: ActionsType, resultItem: Item, itemBefore: Item = null, isItemDirty: boolean = true) {
    // if the action have changed the item, document is no longer dirty save button should be disabled.
    if (isItemDirty) {
      this.isItemDirty = false;
      this.isItemDirtyChanged.emit(this.isItemDirty);
    }
    this.actionEventBus.triggerAction(ActionUtility.createNewAction(action, [resultItem]));
    this.selectedItemsEventBus.set(resultItem);
    this.itemTabsEventBus.update(resultItem, itemBefore);
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

  private updateButtonBehaviour(isItemDirty: boolean = false): void {
    if (this.selectedItems && this.selectedItems.length > 0) {
      let showCheckinSet, showCheckoutSet, showDiscardCheckoutButton, newItem = false;

      this.selectedItems.forEach(item => {
        if (!item.id) {
          newItem = true;
        }
        // CheckIn is shown only if document is checked out by current user
        if (item.checkedOutBy === this.currentUser && !showCheckinSet) {
          showCheckinSet = true;
        }
        // CheckOut is shown only if document is not checked out
        if (!item.checkedOutBy && !showCheckoutSet) {
          showCheckoutSet = true;
        }
        // Check if there is some document checked out
        if (ItemUtility.isCheckedOut(item)) {
          showDiscardCheckoutButton = true;
        }
      });
      this.actionButtons.forEach(button => {

        switch (button.action) {
          case ActionsType.Save:
              button.enabled = isItemDirty || newItem;
            break;
          case ActionsType.CheckIn:
              button.visible = showCheckinSet;
              button.enabled = !newItem;
            break;
          case ActionsType.CheckOut:
              button.visible = showCheckoutSet;
              button.enabled = !newItem;
            break;
          case ActionsType.DiscardCheckOut:
              button.visible = showDiscardCheckoutButton;
              button.enabled = !newItem;
            break;
        }
      });
    }
  }
}
