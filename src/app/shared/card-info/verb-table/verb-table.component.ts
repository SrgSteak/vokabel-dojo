import { Component, OnInit, Input } from '@angular/core';
import { Card } from 'src/app/core/entities/card';
import { VerbType } from 'src/app/core/entities/card-type';

export enum konjugationType {
  masu = 0,
  negatedMasu = 1,
  pastMasu = 2,
  negatedPastMasu = 3,

  neutral = 4,
  negatedNeutral = 5,
  pastNeutral = 6,
  negatedPastNeutral = 7,

  lemma = 10,
  te = 20,
}

export enum vocalType {
  a,
  i,
  u,
  e,
  o
}

@Component({
  selector: 'app-verb-table',
  templateUrl: './verb-table.component.html',
  styleUrls: ['./verb-table.component.scss']
})
export class VerbTableComponent implements OnInit {

  @Input() card: Card;

  get verbTypes() {
    return VerbType;
  }

  get konjugationTypes() {
    return konjugationType;
  }

  private kana = [
    ['わ', 'い', 'う', 'え', 'お'],
    ['か', 'き', 'く', 'け', 'こ'],
    ['さ', 'し', 'す', 'せ', 'そ'],
    ['た', 'ち', 'つ', 'て', 'と'],
    ['な', 'に', 'ぬ', 'ね', 'の'],
    ['は', 'ひ', 'ふ', 'へ', 'ほ'],
    ['ま', 'み', 'む', 'め', 'も'],
    ['や', '', 'ゆ', '', 'よ'],
    ['ら', 'り', 'る', 'れ', 'ろ'],
    ['わ', '', '', '', 'を'],
    ['ん', '', '', '', ''],
    ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
    ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
    ['だ', 'ぢ', 'づ', 'で', 'ど'],
    ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
    ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ']
  ];

  constructor() { }

  ngOnInit() {
  }



  masuForm() {
    // step 1: is verb in the dictionary form? (lemma)
    let lemma;
    if (this.isLemma(this.card.japanese)) {
      lemma = this.card.japanese;

    } else {
      // TODO: check if forms can be revised to lemma out of konjugations
      lemma = this.formLemma(this.card.japanese);
    }
  }

  private isLemma(word: string) {
    return word.indexOf('ます', word.length - 2) === -1;
  }

  private formLemma(word: string) {
    if (this.isMasuForm(word)) {
      // masu form, trim end, bend word or read exception
      let lemma = this.trimMasuForm(word);

    }

    // is lemma
    return word;
  }

  flexLemma(word, type: VerbType, destination: konjugationType) {
    switch (type) {
      case VerbType.single: {
        switch (destination) {
          case konjugationType.masu:
            return word.substring(0, word.length - 1) + 'ます'
          case konjugationType.negatedMasu:
            return word.substring(0, word.length - 1) + 'ません'
          case konjugationType.pastMasu:
            return word.substring(0, word.length - 1) + 'ました'
          case konjugationType.negatedPastMasu:
            return word.substring(0, word.length - 1) + 'ませんでした'
          case konjugationType.negatedNeutral:
            return word.substring(0, word.length - 1) + 'ない'
          case konjugationType.lemma:
            return word;
          case konjugationType.te:
            return word.substring(0, word.length - 1) + 'て';
          default:
            return '';
        }
      }
      case VerbType.five: {
        switch (destination) {
          case konjugationType.masu:
            return word.substring(0, word.length - 1) + this.flexUToI(word.substring(word.length - 1, word.length)) + 'ます'
          case konjugationType.negatedMasu:
            return word.substring(0, word.length - 1) + this.flexUToI(word.substring(word.length - 1, word.length)) + 'ません'
          case konjugationType.pastMasu:
            return word.substring(0, word.length - 1) + this.flexUToI(word.substring(word.length - 1, word.length)) + 'ました'
          case konjugationType.negatedPastMasu:
            return word.substring(0, word.length - 1) + this.flexUToI(word.substring(word.length - 1, word.length)) + 'ませんでした'
          case konjugationType.negatedNeutral:
            return word.substring(0, word.length -1) + this.flex(word.substring(word.length - 1, word.length), vocalType.a) + 'ない'
          case konjugationType.lemma:
            return word;
          case konjugationType.te:
            switch (word.substring(word.length - 1, word.length)) {
              case 'う':
                return word.substring(0, word.length - 1) + 'って';
              case 'る':
                return word.substring(0, word.length - 1) + 'って';
              case 'つ':
                return word.substring(0, word.length - 1) + 'って';
              case 'む':
                return word.substring(0, word.length - 1) + 'んで';
              case 'ぬ':
                return word.substring(0, word.length - 1) + 'んで';
              case 'ぶ':
                return word.substring(0, word.length - 1) + 'んで';
              case 'す':
                return word.substring(0, word.length - 1) + 'して';
              case 'く':
                return word.substring(0, word.length - 1) + 'いて';
              case 'ぐ':
                return word.substring(0, word.length - 1) + 'いで';
            }
          default:
            return '';
        }
      }
      // lasset alle hoffnung fahren
      case VerbType.irregular: {
        return 'not implemented yet';
      }
      case VerbType.suru: {
        return 'not implemented yet';
      }
    }
  }

  private trimMasuForm(word: string) {
    if (this.endsWith(word, 'ます')) {
      return word.substring(0, word.length - 2);
    } else if (this.endsWith(word, 'ます')) {
      return word.substring(0, word.length - 2);
    } else if (this.endsWith(word, 'せんでした')) { // important: check before でした
      return word.substring(0, word.length - 5);
    } else if (this.endsWith(word, 'でした')) {
      return word.substring(0, word.length - 3);
    }
  }

  private isMasuForm(word: string) {
    return this.endsWith(word, 'ます') || this.endsWith(word, 'ません') || this.endsWith(word, 'でした') || this.endsWith(word, 'せんでした');
  }

  private endsWith(word, suffix) {
    return word.indexOf(suffix, word.length - suffix.length) !== -1;
  }

  private flex(syllable: string, vocalType): string {
    for (let row = 0; row < this.kana.length; row++) {
      const element = this.kana[row];
      if (element.indexOf(syllable) !== -1) {
        return element[vocalType];
      }
    }
    return '';
  }

  private flexUToI(syllable): string {
    switch (syllable) {
      case 'る':
        return 'り';
      case 'む':
        return 'み';
      case 'ぷ':
        return 'ぴ';
      case 'ぶ':
        return 'び';
      case 'ふ':
        return 'ひ';
      case 'づ':
        return 'ぢ';
      case 'つ':
        return 'ち';
      case 'ぬ':
        return 'に';
      case 'ず':
        return 'じ';
      case 'す':
        return 'し';
      case 'く':
        return 'き';
      case 'ぐ':
        return 'ぎ';
      case 'う':
        return 'い';
      default:
        return '';
    }
  }
}
