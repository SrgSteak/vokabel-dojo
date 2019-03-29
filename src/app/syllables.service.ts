import { Injectable } from '@angular/core';
import { FlashcardService } from './flashcard.service';

@Injectable({
  providedIn: 'root',
})
export class SyllablesService extends FlashcardService {

  public syllables = {
    a: [
      {german: 'a', hiragana: 'あ', katakana: 'ア'},
      {german: 'i', hiragana: 'い', katakana: 'イ'},
      {german: 'u', hiragana: 'う', katakana: 'ウ'},
      {german: 'e', hiragana: 'え', katakana: 'エ'},
      {german: 'o', hiragana: 'お', katakana: 'オ'}
    ],

    k: [
      {german: 'ka', hiragana: 'か', katakana: 'カ'},
      {german: 'ki', hiragana: 'き', katakana: 'キ'},
      {german: 'ku', hiragana: 'く', katakana: 'ク'},
      {german: 'ke', hiragana: 'け', katakana: 'ケ'},
      {german: 'ko', hiragana: 'こ', katakana: 'コ'}
    ],

    s: [
      {german: 'sa', hiragana: 'さ', katakana: 'サ'},
      {german: 'shi', hiragana: 'し', katakana: 'シ'},
      {german: 'su', hiragana: 'す', katakana: 'ス'},
      {german: 'se', hiragana: 'せ', katakana: 'セ'},
      {german: 'so', hiragana: 'そ', katakana: 'ソ'}
    ],

    t: [
      {german: 'ta', hiragana: 'た', katakana: 'タ'},
      {german: 'chi', hiragana: 'ち', katakana: 'チ'},
      {german: 'tsu', hiragana: 'つ', katakana: 'ツ'},
      {german: 'te', hiragana: 'て', katakana: 'テ'},
      {german: 'to', hiragana: 'と', katakana: 'ト'}
    ],

    na: [
      {german: 'na', hiragana: 'な', katakana: 'ナ'},
      {german: 'ni', hiragana: 'に', katakana: 'ニ'},
      {german: 'nu', hiragana: 'ぬ', katakana: 'ヌ'},
      {german: 'ne', hiragana: 'ね', katakana: 'ネ'},
      {german: 'no', hiragana: 'の', katakana: 'ノ'}
    ],

    h: [
      {german: 'ha', hiragana: 'は', katakana: 'ハ'},
      {german: 'hi', hiragana: 'ひ', katakana: 'ヒ'},
      {german: 'fu', hiragana: 'ふ', katakana: 'フ'},
      {german: 'he', hiragana: 'へ', katakana: 'ヘ'},
      {german: 'ho', hiragana: 'ほ', katakana: 'ホ'}
    ],

    m: [
      {german: 'ma', hiragana: 'ま', katakana: 'マ'},
      {german: 'mi', hiragana: 'み', katakana: 'ミ'},
      {german: 'mu', hiragana: 'む', katakana: 'ム'},
      {german: 'me', hiragana: 'め', katakana: 'メ'},
      {german: 'mo', hiragana: 'も', katakana: 'モ'}
    ],

    y: [
      {german: 'ya', hiragana: 'や', katakana: 'ヤ'},
      {german: 'yu', hiragana: 'ゆ', katakana: 'ユ'},
      {german: 'yo', hiragana: 'よ', katakana: 'ヨ'}
    ],

    r: [
      {german: 'ra', hiragana: 'ら', katakana: 'ラ'},
      {german: 'ri', hiragana: 'り', katakana: 'リ'},
      {german: 'ru', hiragana: 'る', katakana: 'ル'},
      {german: 're', hiragana: 'れ', katakana: 'レ'},
      {german: 'ro', hiragana: 'ろ', katakana: 'ロ'}
    ],

    w: [
      {german: 'wa', hiragana: 'わ', katakana: 'ワ'},
      {german: 'wo', hiragana: 'を', katakana: 'ヲ'}
    ],

    n: [
      {german: 'n', hiragana: 'ん', katakana: 'ン'}
    ],

    dakuten_h: [
      {german: 'ba', hiragana: 'ば', katakana: 'バ'},
      {german: 'bi', hiragana: 'び', katakana: 'ビ'},
      {german: 'bu', hiragana: 'ぶ', katakana: 'ブ'},
      {german: 'be', hiragana: 'べ', katakana: 'ベ'},
      {german: 'bo', hiragana: 'ぼ', katakana: 'ボ'}
    ],
    dakuten_k: [
      {german: 'ga', hiragana: 'が', katakana: 'ガ'},
      {german: 'gi', hiragana: 'ぎ', katakana: 'ギ'},
      {german: 'gu', hiragana: 'ぐ', katakana: 'グ'},
      {german: 'ge', hiragana: 'げ', katakana: 'ゲ'},
      {german: 'go', hiragana: 'ご', katakana: 'ゴ'}
    ],
    dakuten_t: [
      {german: 'da', hiragana: 'だ', katakana: 'ダ'},
      {german: 'ji', hiragana: 'ぢ', katakana: 'ヂ'},
      {german: 'zu', hiragana: 'づ', katakana: 'ヅ'},
      {german: 'de', hiragana: 'で', katakana: 'デ'},
      {german: 'do', hiragana: 'ど', katakana: 'ド'}
    ],
    dakuten_s: [
      {german: 'za', hiragana: 'ざ', katakana: 'ザ'},
      {german: 'ji', hiragana: 'じ', katakana: 'ジ'},
      {german: 'zu', hiragana: 'ず', katakana: 'ズ'},
      {german: 'ze', hiragana: 'ぜ', katakana: 'ゼ'},
      {german: 'zo', hiragana: 'ぞ', katakana: 'ゾ'},
    ],
    handakuten_h: [
      {german: 'pa', hiragana: 'ぱ', katakana: 'パ'},
      {german: 'pi', hiragana: 'ぴ', katakana: 'ピ'},
      {german: 'pu', hiragana: 'ぷ', katakana: 'プ'},
      {german: 'pe', hiragana: 'ぺ', katakana: 'ペ'},
      {german: 'po', hiragana: 'ぽ', katakana: 'ポ'}
    ],
    small_tsu: [
      {german: 'tsu', hiragana: 'っ', katakana: 'ッ'}
    ],
    small_ya_yu_yo: [
      {german: 'ya', hiragana: 'ゃ', katakana: 'ャ'},
      {german: 'yu', hiragana: 'ゅ', katakana: 'ュ'},
      {german: 'yo', hiragana: 'ょ', katakana: 'ョ'}
    ],
    small_aeio: [
      {german: 'e', hiragana: '', katakana: 'ェ'},
      {german: 'a', hiragana: '', katakana: 'ァ'},
      {german: 'i', hiragana: '', katakana: 'ィ'},
      {german: 'o', hiragana: '', katakana: 'ォ'}
    ],
    choonpu: [
      {german: 'ー', hiragana: 'ー', katakana: 'ー'}
    ]
  };

  getAll() {
    return this.getForRows(
      ['a', 'k', 's', 't', 'na', 'h', 'm', 'y', 'r', 'w', 'n', 'dakuten_h', 'dakuten_k', 'dakuten_t', 'dakuten_s', 'handakuten_h', 'small_tsu', 'small_ya_yu_yo', 'small_aeio', 'choonpu']
    );
  }

  getForRows(rows: Array<string>) {
    let selected_rows = [];
    rows.forEach(row => {
      selected_rows = selected_rows.concat(this.syllables[row]);
    });
    return selected_rows;
  }

  getCardsContaining(word: string, extras: number) {
    const deck = [];
    let syllables = this.getAll();
    word.split('').forEach((char: string) => {
      const syllable = syllables.find((card) => { return card.german === char || card.hiragana === char || card.katakana === char});
      deck.push(syllable);
    });
    syllables = this.shuffle(syllables);
    for (let index = 0; index < extras; index++) {
      deck.push(syllables[index]);
    }
    return this.shuffle(deck);
  }
}

export interface flashcard {
  hiragana: string;
  katakana: string;
  german: string;
}