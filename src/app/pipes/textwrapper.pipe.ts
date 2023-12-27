import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textwrapper',
  standalone: true
})
export class TextwrapperPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
