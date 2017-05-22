import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SohoComponentsModule } from '@infor/sohoxi-angular';

import { DocumentDetailsComponent } from './document-details.component';
import { PreviewComponent } from './preview/preview.component';
import { DocumentDetailTabsComponent } from './document-detail-tabs/document-detail-tabs.component';
import { AddFileComponent } from './add-file/add-file.component';
import { DocumentAttributesComponent } from './document-attributes/document-attributes.component';
import { SharedClientModule } from '../shared-client/shared-client.module';
import { DropdownAsyncComponent } from '../shared-client/dropdown/dropdown-async.component';
import { PipesModule } from "pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    SohoComponentsModule,
    FormsModule,
    SharedClientModule,
    PipesModule,
  ],
  exports: [
    DocumentDetailsComponent
  ],
  declarations: [
    AddFileComponent,
    DocumentAttributesComponent,
    DropdownAsyncComponent,
    DocumentDetailsComponent,
    DocumentDetailTabsComponent,
    PreviewComponent
  ],
  providers: []
})
export class DocumentDetailsModule { }