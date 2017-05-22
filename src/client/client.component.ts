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
import { XQueryEventBus, ItemTabsEventBus, DocumentsEventBus } from 'event-buses';
import { Item, ItemTab } from 'models';
import { Translator } from 'services';

import { AddDocumentComponent } from './document-details/add-document/add-document.component';

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

  private dialogRef;

  constructor(
    private xQueryEventBus: XQueryEventBus,
    private changeDetectorRef: ChangeDetectorRef, 
    private itemTabsEventBus: ItemTabsEventBus,
    private documentsEventBus: DocumentsEventBus,
    private modalService: SohoModalDialogService,
    public translator: Translator
  ) {
    this.subscribeToxQueryChangedEvent();
    this.subscribeToItemTabAddedEvent();
    this.subscribeToCreateDocumentModal();
    this.initxQuery();
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
    this.documentsEventBus.onCreateDocumentModal.subscribe(item => {
      this.itemTabsEventBus.openNewItemTab(item);
      this.dialogRef.close();
    });
  }

  public initxQuery() {
    this.xQueryEventBus.initxQuery();
  }

  onTabActivated(tab) {
    
  }

  selectTab(id: string) {
    this.tabsComponent.select(id);
  }

  onTabClose(tab: any) {
    let tabId = tab.tab.children.item("a").getAttribute("ng-reflect-tab-id");
    this.itemTabsEventBus.closeItemTab(tabId);
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
              this.itemTabsEventBus.openItemTab(dialogComponent.selectedTemplate);
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

    // Attach a listener to the afterClose event, which also gives you the result - if available.
    this.dialogRef.afterClose((result, ref, dialogComponent) => {
      // TODO: add cleanup routine, if required
    });
  }
}
