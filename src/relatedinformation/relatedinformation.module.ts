import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RelatedinformationComponent } from './relatedinformation.component';

@NgModule({
  declarations: [
    RelatedinformationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
  ],
  exports: [RelatedinformationComponent],
  providers: [],
})
export class RelatedinformationModule { }
