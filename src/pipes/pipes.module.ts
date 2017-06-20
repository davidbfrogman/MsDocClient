import { Pipe, PipeTransform, NgModule } from '@angular/core';
import { Translator } from 'services'; // our translate service
import {TranslatePipe} from './translate.pipe';
import { MaxlengthPipe } from './maxlength.pipe';

 @NgModule({
     declarations:   [TranslatePipe, MaxlengthPipe],
     exports:        [TranslatePipe, MaxlengthPipe],
 })
export class PipesModule {}
