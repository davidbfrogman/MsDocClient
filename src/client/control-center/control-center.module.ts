import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SohoComponentsModule } from '@infor/sohoxi-angular';

import { ControlCenterComponent} from './control-center.component';

@NgModule({
  imports: [
    CommonModule,
    SohoComponentsModule
  ],
  exports: [
    ControlCenterComponent
  ],
  declarations: [ControlCenterComponent],
  providers: []
})
export class ControlCenterModule { }


