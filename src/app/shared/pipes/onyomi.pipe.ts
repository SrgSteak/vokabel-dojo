import { Pipe, PipeTransform } from '@angular/core';
import { CardInterface } from 'src/app/core/entities/card-interface';

export enum readingType {
  kun,
  on
}

@Pipe({
  name: 'onyomi'
})
export class OnyomiPipe implements PipeTransform {

  private kanjiRegExp = new RegExp(/[\u3300-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/);

  /**
   * transforms 食べません to <ruby>食<rt>た</rt></ruby>べません
   * or これは日本語です。　to これは<ruby>日<rt>に</rt>本<rt>ほん</rt>語<rt>ご</rt>です
   * @param value your phrase
   * @param args currently none
   */
  transform(value: any, ...args: any[]): any {
    return null;
  }

  /**
   * returns an array of all chars and words that needs to be rubified
   * @param phrase the text you want to rubify
   */
  filterWordsAndChars(phrase: string): Array<string> {
    let kanjiWords = [];
    let currentWord = '';
    [...phrase].forEach((char, index) => {
      if (this.isKanji(char)) { // found a kanji, check following chars until you find the last one
        currentWord += char;
      } else { // not a kanji. add current string to kanjiWords and reset for the next
        if (currentWord.length) {
          kanjiWords.push(currentWord);
          currentWord = '';
        }
      }
    });
    if (currentWord.length) {
      kanjiWords.push(currentWord);
    }

    return kanjiWords;
  }

  /**
   * TODO: add prev and next word
   * @param phrase the char or word you want to add ruby to.
   */
  addRuby(phrase: string): string {
    let enriched = '<ruby>' + phrase + '<rt>';
    const kanjis = [];
    [...phrase].forEach((char) => {
      kanjis.push(this.loadKanji(char));
    });
    const type = this.decideReading(phrase);
    // reading type is simple, add kun or on reading
    if (type === readingType.kun || type === readingType.on) {
      kanjis.forEach(kanji => {
        if (type === readingType.kun) {
          enriched += kanji.japanese_readings[0];
        } else {
          enriched += kanji.chinese_readings[0];
        }
      });
    } else {
      // TODO: create special rule type
    }
    return enriched + '</rt></ruby>';
  }

  /**
   * load kanji card from the database
   * @param char
   */
  loadKanji(char: string): CardInterface {
    return
  }

  /**
   * returns the type of reading you need to correctly add rubi
   * TODO: phrase alone is not enough. add prev and next words to add context for example
   * when okurigana is "じる" or "ずる" (*):
   * 準じる, 準ずる, 講じる, 講ずる ... leading kanjis are "On".
   * @param phrase the word you want the rubi type to have
   */
  private decideReading(phrase): readingType {
    if (phrase.length === 1) {
      // a kanji by itself should use the kun reading
      return readingType.kun;
    }
    // more than one character, find out
    return readingType.on;
  }

  private isKanji(char: string): boolean {
    return this.kanjiRegExp.test(char);
  }
}
