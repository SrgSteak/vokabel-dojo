import { Pipe, PipeTransform } from '@angular/core';
import { OnyomiJapanese } from "src/app/core/entities/OnyomiJapanese";

@Pipe({
  name: 'onyomi',
  standalone: true
})
export class OnyomiPipe implements PipeTransform {


  /**
   * transforms 食べません to <ruby>食<rt>た</rt></ruby>べません
   * or これは日本語です。　to これは<ruby>日<rt>に</rt>本<rt>ほん</rt>語<rt>ご</rt>です
   */
  transform(
    text: string | OnyomiJapanese,
    reading?: string,
    highlight?: { from: number, to?: number, type?: string}): string {
      if (text === null || text === undefined) {
        return '';
      }
      try {
        const _text = typeof text === 'object' ? text.japanese : text;
        const _reading = typeof text === 'object' ? text.reading : reading;
        const _highlight= typeof text === 'object' ? text.highlight : highlight;
        if (typeof text === 'object') {
        } else {

        }
      if (_highlight && !_highlight.to) {
        _highlight.to = _highlight.from + 1;
      }
      let rubyString: string;

      if (!_reading.length) {
        if (_highlight) {
          let rubyString = '<ruby class="empty">';
          for (let index = 0; index < _text.length; index++) {
            if (_highlight.from === index) {
              rubyString += `</ruby><ruby class="empty ${ typeof _highlight.type === 'string' ? _highlight.type : 'highlight'}">`
            }

            rubyString += `${_text[index]}`

            if (_highlight.to === index) {
              rubyString += `</ruby>`
            }
          }
          return rubyString;
        } else {
          return `<ruby class="empty">${ _text }</ruby>`;
        }
      }

      rubyString = '<ruby>';
      let rts = _reading.split('*');


      for (let index = 0; index < _text.length; index++) {
        if (_highlight && _highlight.from === index) {
          rubyString += `</ruby><ruby class="${_highlight.type ? _highlight.type : 'highlight'}">${_text[index]}<rt>${rts[index]}</rt>`
        } else if (_highlight && _highlight.to === index) {
          rubyString += `${_text[index]}<rt>${rts[index]}</rt></ruby>`
        } else {
          rubyString += `${_text[index]}<rt>${rts[index]}</rt>`
        }
      }
      return rubyString;
      } catch (error) {
        console.log(text, error);
      }
  }

  // private kanjiRegExp = new RegExp(/[\u3300-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/);
  // private isKanji(char: string): boolean {
  //   return this.kanjiRegExp.test(char);
  // }
}
