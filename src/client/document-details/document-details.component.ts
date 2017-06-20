import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { ErrorEventBus, ConfigurationEventBus, ActionEventBus } from 'event-buses';
import { Item, Entity } from 'models';
import { ItemService, EntityService } from 'services';
import { ActionsType, ActionViewsType } from 'enumerations';
import { ItemUtility } from 'utility';
import { Constants } from '../../constants';
import { Translator } from 'services';
@Component({
  selector: 'idm-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss']
})
export class DocumentDetailsComponent {
  private _item: Item;
  private _entity: Entity;
  public selectedItems: Item[] = [];
  public actionViewsType = ActionViewsType; // Added to use the enums in the html
  public fileSize: string;
  @Input() tabId;
  public isItemEditable: boolean;
  public isItemDirty: boolean;

  constructor(
    public actionEventBus: ActionEventBus,
    private entityService: EntityService,
    private errorEventBus: ErrorEventBus,
    private itemService: ItemService,
    private configurationEventBus: ConfigurationEventBus,
    public translator: Translator
  ) {
    this.subscribeToDocumentChanged();
  }

  @Input()
  set item(item: Item) {
    this._item = item;
    this.selectedItems = [item];
    if (this.item.size) {
      this.fileSize = ItemUtility.formatBytes(Number(this.item.size));
    }

    this.entityService.get<Entity>(item.entityName).subscribe(entity => {
      this._entity = entity;
    }, error => {
      this.errorEventBus.throw(error);
    });

    const currentUser = this.configurationEventBus.getConfiguration(Constants.PROP_CONNECTION_USERNAME);
    this.isItemEditable = ItemUtility.isEditable(this.item, currentUser);
  }

  get item(): Item {
    return this._item;
  }

  get entity(): Entity {
    return this._entity;
  }

  protected subscribeToDocumentChanged() {
    this.actionEventBus.itemDirtyChanged$.subscribe(action => {
      if (this.item.uniqueId === action.affectedItems[0].uniqueId) {
        this.isItemDirty = true;
      }
    });
  }

  protected isItemDirtyChanged(isItemDirty: boolean) {
    this.isItemDirty = isItemDirty;
  }
}
