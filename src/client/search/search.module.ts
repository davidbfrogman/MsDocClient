import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SohoComponentsModule } from '@infor/sohoxi-angular';
import { SharedClientModule } from '../shared-client/shared-client.module';

import {SearchComponent} from './search.component';
import {AdvancedSearchComponent} from './advanced-search/advanced-search.component';
import {AttributeSearchComponent} from './attribute-search/attribute-search.component';
import {ShortcutsComponent} from './shortcuts/shortcuts.component';
import { SearchStackComponent } from './search-stack/search-stack.component';
import { SearchStackEventBus, ResourceQueueEventBus } from '../../event-buses';
import { PipesModule } from "pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    SohoComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedClientModule,
    PipesModule,
  ],
  declarations: [  
    SearchComponent,
    AdvancedSearchComponent,
    AttributeSearchComponent,
    ShortcutsComponent,
    SearchStackComponent
  ],
  exports: [SearchComponent],
  providers: [
    SearchStackEventBus,
    ResourceQueueEventBus
  ]
})
export class SearchModule {
}
