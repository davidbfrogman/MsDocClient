import { Component, Input, ViewChild, QueryList, ViewEncapsulation, OnChanges } from '@angular/core';
import { SohoDropDownComponent, SohoBusyIndicatorDirective } from '@infor/sohoxi-angular';
import { Subject } from 'rxjs/Rx';
import { Entity, Item, Acl } from 'models';
import { EntityService, ItemService } from 'services';
import { ActionEventBus, ItemTabsEventBus, ErrorEventBus } from 'event-buses';
import { ActionUtility, ItemUtility } from 'utility';
import { Translator } from 'services';
import { ActionsType } from 'enumerations';

@Component({
  selector: 'idm-document-detail-tabs',
  templateUrl: './document-detail-tabs.component.html',
  styleUrls: ['./document-detail-tabs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentDetailTabsComponent implements OnChanges {
  @Input() item: Item;
  @Input() isItemEditable: boolean;
  @Input() tabId: string;
  private _entity: Entity;
  public itemVersions: Item[] = [];
  public acls: Acl[];
  public fileSize;

  constructor(
    private actionEventBus: ActionEventBus,
    private itemService: ItemService,
    private itemTabsEventBus: ItemTabsEventBus,
    private errorEventBus: ErrorEventBus,
    private entityService: EntityService,
    public translator: Translator
  ) { };

  @Input()
  set entity(entity: Entity) {
    if (entity) {
      this._entity = entity;
      this.acls = entity.acls.acl;
    }
  }

  get entity(): Entity {
    return this._entity;
  }

  ngOnChanges() {
    if (this.item.size) {
      this.fileSize = ItemUtility.formatBytes(Number(this.item.size));
    }
  }

  retrieveVersions() {
    if (this.item.pid) {
      this.itemService.getVersions(this.item.pid).subscribe((itemResult: Item[]) => {
        this.itemVersions = itemResult['item'];
      }, error => {
        this.errorEventBus.throw(error);
      });
    }
  }

  showLatestVersion() {
    this.itemService.retrieve(this.item.pid).subscribe((itemResult: Item) => {
      ItemUtility.setUniqueId(itemResult);
      this.itemTabsEventBus.open(itemResult);
    });
  }

  showVersion(version) {
    this.itemService.getVersion(this.item.pid, version).subscribe((itemResult: Item) => {
      ItemUtility.setUniqueId(itemResult);
      this.itemTabsEventBus.open(itemResult);
    });
  }

  onAclChange(): void {
    this.actionEventBus.triggerItemDirtyChangeAction(
      ActionUtility.createNewAction(ActionsType.Save, [this.item]));
  }
}
