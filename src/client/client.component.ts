import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ViewContainerRef,
  Input
} from '@angular/core';
import { SohoTabsComponent, SohoModalDialogService } from '@infor/sohoxi-angular';
import { environment } from '../environments/environment';
import { XQueryEventBus, ItemTabsEventBus, DocumentsEventBus, ActionEventBus, ConfigurationEventBus } from 'event-buses';
import { Item, ItemTab } from 'models';
import { Translator } from 'services';

import { AddDocumentComponent } from './document-details/add-document/add-document.component';
import { Constants } from '../constants';

@Component({
  selector: 'idm-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent {
  @ViewChild(SohoTabsComponent) private tabsComponent: SohoTabsComponent;
  @ViewChild('addDocumentDialogPlaceholder', { read: ViewContainerRef })
  addDocumentDialogPlaceholder: ViewContainerRef;

  public development: boolean = (environment.production === false);
  public xQuery: string;
  public currentUser: string;

  private dialogRef;

  constructor(
    private xQueryEventBus: XQueryEventBus,
    private changeDetectorRef: ChangeDetectorRef,
    private itemTabsEventBus: ItemTabsEventBus,
    private documentsEventBus: DocumentsEventBus,
    private actionEventBus: ActionEventBus,
    private modalService: SohoModalDialogService,
    public translator: Translator,
    private configurationEventBus: ConfigurationEventBus
  ) {
    this.subscribeToxQueryChangedEvent();
    this.subscribeToItemTabAddedEvent();
    this.subscribeToCreateDocumentModal();
    this.initxQuery();
    this.currentUser = configurationEventBus.getConfiguration(Constants.PROP_CONNECTION_USERNAME);
  }

  protected subscribeToxQueryChangedEvent() {
    this.xQueryEventBus.xQueryChanged$.subscribe((xQuery) => {
      this.xQuery = xQuery;
    });
  }

  protected subscribeToItemTabAddedEvent() {
    this.itemTabsEventBus.itemTabOpened$.subscribe((itemTab: ItemTab) => {
      this.changeDetectorRef.detectChanges();
      this.selectTab(itemTab.tabId);
    });
  }

  protected subscribeToCreateDocumentModal() {
    this.documentsEventBus.documentEventCreate$.subscribe(item => {
      this.itemTabsEventBus.open(item);
      this.dialogRef.close();
    });
  }

  public initxQuery() {
    this.xQueryEventBus.initxQuery();
  }

  onTabActivated(tab) { }

  selectTab(id: string) {
    this.tabsComponent.select(id);
  }

  onTabClose(tab: any) {
    // Using href here since that's the only place where the full ID is
    // stored in the soho-tab component
    let tabId: string = tab.tab.children.item('a').getAttribute('href');
    if (tabId.startsWith('#')) {
      tabId = tabId.slice(1, tabId.length);
    }
    this.itemTabsEventBus.close(tabId);
  }

  openAddDocumentComponent() {
    let dialogComponent: AddDocumentComponent;
    this.dialogRef = this.modalService
      .modal<AddDocumentComponent>(
        AddDocumentComponent,
        this.addDocumentDialogPlaceholder
      )
      .buttons([
        {
          text: 'Cancel',
          click: (e, modal) => {
            modal.isCancelled = true;
            this.dialogRef.close();
          }
        },
        {
          text: 'Create',
          click: (e, modal) => {
            if (dialogComponent.isSaveEnabled) {
              this.itemTabsEventBus.open(dialogComponent.selectedTemplate);
              this.dialogRef.close();
            }
          },
          isDefault: true
        }
      ])
      .title('')
      .isAlert(false)
      .apply((component) => {
        dialogComponent = component;
      })
      .open();
  }
}
