import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'matchLabel',
    standalone: true
})
export class MatchLabelPipe implements PipeTransform {

  transform(value: any[], args?: string): any[] {
    if (value && args) {
      return value.filter(e => e.label.toLowerCase().indexOf(args.toLocaleLowerCase()) >= 0);
    }
    return value;
  }

}
// TODO: use generics (MatchLabelPipe<T extends { label: string }>) and replace any, wait until error handling in angular language is improved (should be the case in Angular 9)
