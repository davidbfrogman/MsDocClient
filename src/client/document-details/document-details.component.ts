import { Component, Input } from '@angular/core';
import { ErrorEventBus, ActionEventBus } from 'event-buses';
import { Item, Entity } from 'models';
import { ItemService, EntityService } from 'services';
import { ActionsType, ActionViewsType } from 'enumerations';
import { ItemUtility } from 'utility';

@Component({
  selector: 'idm-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss']
})
export class DocumentDetailsComponent {
  private _item: Item;
  private _entity: Entity;
  public actionViewsType = ActionViewsType; // Added to use the enums in the html
  public fileSize: string;
  public tabId;

  constructor(
    private entityService: EntityService,
    private errorEventBus: ErrorEventBus,
    private itemService: ItemService,
    private actionEventBus: ActionEventBus
  ) {
    this.subscribeToActionChangedEvent();
  }

  protected subscribeToActionChangedEvent() {
    this.actionEventBus.actionChanged$.subscribe((action) => {
      action.affectedItems.forEach(updatedItem => {
        if (ItemUtility.isTheSameItem(this._item, updatedItem)) {
          this._item = updatedItem;
        }
      });
    });
  }

  @Input()
  set item(item: Item) {
    this._item = item;

    if (this.item.size) {
      this.fileSize = ItemUtility.formatBytes(Number(this.item.size));
    }

    this.entityService.get<Entity>(item.entityName).subscribe(entity => {
      this._entity = entity;
    }, error => {
      this.errorEventBus.throw(error);
    });

    this.tabId = this.item.entityName + '-' + this.item.id;
  }

  get item(): Item {
    return this._item;
  }

  get entity(): Entity {
    return this._entity;
  }
}
