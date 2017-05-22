import { Pipe, PipeTransform, NgModule } from '@angular/core';
import { Translator } from 'services'; // our translate service
import {TranslatePipe} from './translate.pipe';

 @NgModule({
     declarations:   [TranslatePipe],
     exports:        [TranslatePipe],
 })
export class PipesModule {}
