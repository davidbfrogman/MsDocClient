import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxlength'
})
export class MaxlengthPipe implements PipeTransform {
  public transform(value: string | number): number {
    return value.toString().length;
  }
}
