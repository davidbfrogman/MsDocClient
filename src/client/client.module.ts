import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { SohoComponentsModule } from '@infor/sohoxi-angular';
import { SharedClientModule } from './shared-client/shared-client.module';

import { SearchModule } from './search/search.module';
import { SearchResultModule} from './search-result/search-result.module';
import { DocumentDetailsModule} from './document-details/document-details.module';
import { ControlCenterModule} from './control-center/control-center.module';
import { AddDocumentComponent } from './document-details/add-document/add-document.component';

import { ClientComponent } from './client.component';
import { ServiceUtilityComponent } from '../client/service-utility/service-utility.component';
import { ModalComponent } from './shared-client/modal/modal.component';
import { XQueryEventBus, ItemTabsEventBus, ActionEventBus, SelectedItemsEventBus, DocumentsEventBus } from 'event-buses';
import { PipesModule } from "pipes/pipes.module";
@NgModule({
  declarations: [
    ClientComponent,
    ServiceUtilityComponent,
    AddDocumentComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    SohoComponentsModule,
    SharedClientModule,
    SearchModule,
    SearchResultModule,
    DocumentDetailsModule,
    ControlCenterModule,
    ReactiveFormsModule,
    PipesModule
  ],
  providers: [
    XQueryEventBus,
    ItemTabsEventBus,
    ActionEventBus,
    SelectedItemsEventBus,
    DocumentsEventBus
  ],
  entryComponents: [
    AddDocumentComponent
  ]
})
export class ClientModule { }
