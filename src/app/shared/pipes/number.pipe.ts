import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'number'
})
export class NumberPipe implements PipeTransform {

  transform(value: any, format = 'hiragana'): any {
    switch (format) {
      case 'hiragana':

        break;
      case 'kanji':
        break;
    }
    return null;
  }

  // numberToHiragana(number: number) {
  //   if (number < 11) {
  //     switch (number) {
  //       case 0:
  //         return 'れい';
  //       case 1:
  //         return 'いち';
  //       case 2:
  //         return 'に';
  //       case 3:
  //         return 'さん';

  //       case 4:
  //         return 'し';

  //       case 5:
  //         return 'ご';

  //       case 6:
  //         return 'ろく';

  //       case 7:
  //         return 'なな';

  //       case 8:
  //         return 'はち';

  //       case 9:
  //         return 'きゅう';

  //       case 10:
  //         return 'じゅう';
  //       default:
  //         break;
  //     }
  //   } else if (number < 100) {
  //     switch
  //   }
  // }
}
