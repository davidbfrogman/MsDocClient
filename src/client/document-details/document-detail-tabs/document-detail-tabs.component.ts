import { Component, Input, ViewChild, OnInit, QueryList, ViewEncapsulation } from '@angular/core';
import { SohoDropDownComponent, SohoBusyIndicatorDirective } from '@infor/sohoxi-angular';
import { Subject } from 'rxjs/Rx';
import { Entity, Item, Acl } from 'models';
import { EntityService, ItemService } from 'services';
import { ItemTabsEventBus, ErrorEventBus } from 'event-buses';
import { ItemUtility } from 'utility';
import { Translator } from 'services';

@Component({
  selector: 'idm-document-detail-tabs',
  templateUrl: './document-detail-tabs.component.html',
  styleUrls: ['./document-detail-tabs.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DocumentDetailTabsComponent implements OnInit {
  @Input() item: Item;
  private _entity: Entity;

  public itemVersions: Item[];
  public tabId: string;
  public acls: Acl[];
  public fileSize;

  constructor(
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

  ngOnInit() {
    this.tabId = this.item.entityName + '-' + this.item.id;
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

  showVersion(version) {
    this.itemService.getVersion(this.item.pid, version).subscribe((itemResult: Item) => {
      this.itemTabsEventBus.openItemTab(itemResult);
    });
  }
}
