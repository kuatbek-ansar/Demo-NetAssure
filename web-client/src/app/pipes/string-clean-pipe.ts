import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'cleanString'})
export class StringCleanPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(new RegExp('\\\\"', 'g'), '');
  }
}
