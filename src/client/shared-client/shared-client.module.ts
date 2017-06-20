import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SohoComponentsModule } from '@infor/sohoxi-angular';
import { ActionMenuComponent } from './action-menu/action-menu.component';
import { ResourceImageComponent } from './resource-image/resource-image.component';
import { IdmIconsComponent } from './idm-icons.component';
import { FormFieldComponent  } from './form/form-field/form-field.component';
import { AttributeFieldComponent  } from './form/attribute-field/attribute-field.component';
import { SearchResultsPagerComponent } from './search-results-pager/search-results-pager.component';
import { PipesModule } from 'pipes/pipes.module';
import { ValidatedDirective } from './validator/validator.directive';

@NgModule({
  imports: [
    CommonModule,
    SohoComponentsModule,
    FormsModule,
    PipesModule
  ],
  exports: [
   ActionMenuComponent,
   IdmIconsComponent,
   AttributeFieldComponent,
   ResourceImageComponent,
   SearchResultsPagerComponent,
   ValidatedDirective
  ],
  declarations: [
    ActionMenuComponent,
    IdmIconsComponent,
    FormFieldComponent,
    AttributeFieldComponent,
    ResourceImageComponent,
    IdmIconsComponent,
    SearchResultsPagerComponent,
    ValidatedDirective
  ]
})
export class SharedClientModule { }


