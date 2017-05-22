import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SohoComponentsModule } from '@infor/sohoxi-angular';
import { SharedClientModule } from '../shared-client/shared-client.module';
import { SearchResultComponent } from './search-result.component';
import { CardListComponent } from './card-list/card-list.component';
import { DetailListComponent } from './detail-list/detail-list.component';
import { ThumbnailListComponent } from './thumbnail-list/thumbnail-list.component';
import { ListViewSelectorComponent } from './list-view-selector/list-view-selector.component';
import { ViewSelectorEventBus } from 'event-buses';
import { PipesModule } from 'pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    SohoComponentsModule,
    FormsModule,
    SharedClientModule,
    PipesModule,
  ],
  exports: [
    SearchResultComponent
  ],
  declarations: [
    SearchResultComponent,
    CardListComponent,
    DetailListComponent,
    ThumbnailListComponent,
    ListViewSelectorComponent],
  providers: [ViewSelectorEventBus]
})
export class SearchResultModule { }


