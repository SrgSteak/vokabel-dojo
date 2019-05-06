import { Injectable } from '@angular/core';
import { FlashcardService } from './flashcard.service';

@Injectable({
  providedIn: 'root',
})
export class SyllablesService extends FlashcardService {

  public syllables = {
    a: [
      {hits: 0, misses: 0, german: 'a', hiragana: 'あ', katakana: 'ア'},
      {hits: 0, misses: 0, german: 'i', hiragana: 'い', katakana: 'イ'},
      {hits: 0, misses: 0, german: 'u', hiragana: 'う', katakana: 'ウ'},
      {hits: 0, misses: 0, german: 'e', hiragana: 'え', katakana: 'エ'},
      {hits: 0, misses: 0, german: 'o', hiragana: 'お', katakana: 'オ'}
    ],

    k: [
      {hits: 0, misses: 0, german: 'ka', hiragana: 'か', katakana: 'カ'},
      {hits: 0, misses: 0, german: 'ki', hiragana: 'き', katakana: 'キ'},
      {hits: 0, misses: 0, german: 'ku', hiragana: 'く', katakana: 'ク'},
      {hits: 0, misses: 0, german: 'ke', hiragana: 'け', katakana: 'ケ'},
      {hits: 0, misses: 0, german: 'ko', hiragana: 'こ', katakana: 'コ'}
    ],

    s: [
      {hits: 0, misses: 0, german: 'sa', hiragana: 'さ', katakana: 'サ'},
      {hits: 0, misses: 0, german: 'shi', hiragana: 'し', katakana: 'シ'},
      {hits: 0, misses: 0, german: 'su', hiragana: 'す', katakana: 'ス'},
      {hits: 0, misses: 0, german: 'se', hiragana: 'せ', katakana: 'セ'},
      {hits: 0, misses: 0, german: 'so', hiragana: 'そ', katakana: 'ソ'}
    ],

    t: [
      {hits: 0, misses: 0, german: 'ta', hiragana: 'た', katakana: 'タ'},
      {hits: 0, misses: 0, german: 'chi', hiragana: 'ち', katakana: 'チ'},
      {hits: 0, misses: 0, german: 'tsu', hiragana: 'つ', katakana: 'ツ'},
      {hits: 0, misses: 0, german: 'te', hiragana: 'て', katakana: 'テ'},
      {hits: 0, misses: 0, german: 'to', hiragana: 'と', katakana: 'ト'}
    ],

    na: [
      {hits: 0, misses: 0, german: 'na', hiragana: 'な', katakana: 'ナ'},
      {hits: 0, misses: 0, german: 'ni', hiragana: 'に', katakana: 'ニ'},
      {hits: 0, misses: 0, german: 'nu', hiragana: 'ぬ', katakana: 'ヌ'},
      {hits: 0, misses: 0, german: 'ne', hiragana: 'ね', katakana: 'ネ'},
      {hits: 0, misses: 0, german: 'no', hiragana: 'の', katakana: 'ノ'}
    ],

    h: [
      {hits: 0, misses: 0, german: 'ha', hiragana: 'は', katakana: 'ハ'},
      {hits: 0, misses: 0, german: 'hi', hiragana: 'ひ', katakana: 'ヒ'},
      {hits: 0, misses: 0, german: 'fu', hiragana: 'ふ', katakana: 'フ'},
      {hits: 0, misses: 0, german: 'he', hiragana: 'へ', katakana: 'ヘ'},
      {hits: 0, misses: 0, german: 'ho', hiragana: 'ほ', katakana: 'ホ'}
    ],

    m: [
      {hits: 0, misses: 0, german: 'ma', hiragana: 'ま', katakana: 'マ'},
      {hits: 0, misses: 0, german: 'mi', hiragana: 'み', katakana: 'ミ'},
      {hits: 0, misses: 0, german: 'mu', hiragana: 'む', katakana: 'ム'},
      {hits: 0, misses: 0, german: 'me', hiragana: 'め', katakana: 'メ'},
      {hits: 0, misses: 0, german: 'mo', hiragana: 'も', katakana: 'モ'}
    ],

    y: [
      {hits: 0, misses: 0, german: 'ya', hiragana: 'や', katakana: 'ヤ'},
      {hits: 0, misses: 0, german: 'yu', hiragana: 'ゆ', katakana: 'ユ'},
      {hits: 0, misses: 0, german: 'yo', hiragana: 'よ', katakana: 'ヨ'}
    ],

    r: [
      {hits: 0, misses: 0, german: 'ra', hiragana: 'ら', katakana: 'ラ'},
      {hits: 0, misses: 0, german: 'ri', hiragana: 'り', katakana: 'リ'},
      {hits: 0, misses: 0, german: 'ru', hiragana: 'る', katakana: 'ル'},
      {hits: 0, misses: 0, german: 're', hiragana: 'れ', katakana: 'レ'},
      {hits: 0, misses: 0, german: 'ro', hiragana: 'ろ', katakana: 'ロ'}
    ],

    w: [
      {hits: 0, misses: 0, german: 'wa', hiragana: 'わ', katakana: 'ワ'},
      {hits: 0, misses: 0, german: 'wo', hiragana: 'を', katakana: 'ヲ'}
    ],

    n: [
      {hits: 0, misses: 0, german: 'n', hiragana: 'ん', katakana: 'ン'}
    ],

    dakuten_h: [
      {hits: 0, misses: 0, german: 'ba', hiragana: 'ば', katakana: 'バ'},
      {hits: 0, misses: 0, german: 'bi', hiragana: 'び', katakana: 'ビ'},
      {hits: 0, misses: 0, german: 'bu', hiragana: 'ぶ', katakana: 'ブ'},
      {hits: 0, misses: 0, german: 'be', hiragana: 'べ', katakana: 'ベ'},
      {hits: 0, misses: 0, german: 'bo', hiragana: 'ぼ', katakana: 'ボ'}
    ],
    dakuten_k: [
      {hits: 0, misses: 0, german: 'ga', hiragana: 'が', katakana: 'ガ'},
      {hits: 0, misses: 0, german: 'gi', hiragana: 'ぎ', katakana: 'ギ'},
      {hits: 0, misses: 0, german: 'gu', hiragana: 'ぐ', katakana: 'グ'},
      {hits: 0, misses: 0, german: 'ge', hiragana: 'げ', katakana: 'ゲ'},
      {hits: 0, misses: 0, german: 'go', hiragana: 'ご', katakana: 'ゴ'}
    ],
    dakuten_t: [
      {hits: 0, misses: 0, german: 'da', hiragana: 'だ', katakana: 'ダ'},
      {hits: 0, misses: 0, german: 'ji', hiragana: 'ぢ', katakana: 'ヂ'},
      {hits: 0, misses: 0, german: 'zu', hiragana: 'づ', katakana: 'ヅ'},
      {hits: 0, misses: 0, german: 'de', hiragana: 'で', katakana: 'デ'},
      {hits: 0, misses: 0, german: 'do', hiragana: 'ど', katakana: 'ド'}
    ],
    dakuten_s: [
      {hits: 0, misses: 0, german: 'za', hiragana: 'ざ', katakana: 'ザ'},
      {hits: 0, misses: 0, german: 'ji', hiragana: 'じ', katakana: 'ジ'},
      {hits: 0, misses: 0, german: 'zu', hiragana: 'ず', katakana: 'ズ'},
      {hits: 0, misses: 0, german: 'ze', hiragana: 'ぜ', katakana: 'ゼ'},
      {hits: 0, misses: 0, german: 'zo', hiragana: 'ぞ', katakana: 'ゾ'},
    ],
    handakuten_h: [
      {hits: 0, misses: 0, german: 'pa', hiragana: 'ぱ', katakana: 'パ'},
      {hits: 0, misses: 0, german: 'pi', hiragana: 'ぴ', katakana: 'ピ'},
      {hits: 0, misses: 0, german: 'pu', hiragana: 'ぷ', katakana: 'プ'},
      {hits: 0, misses: 0, german: 'pe', hiragana: 'ぺ', katakana: 'ペ'},
      {hits: 0, misses: 0, german: 'po', hiragana: 'ぽ', katakana: 'ポ'}
    ],
    small_tsu: [
      {hits: 0, misses: 0, german: 'tsu', hiragana: 'っ', katakana: 'ッ'}
    ],
    small_ya_yu_yo: [
      {hits: 0, misses: 0, german: 'ya', hiragana: 'ゃ', katakana: 'ャ'},
      {hits: 0, misses: 0, german: 'yu', hiragana: 'ゅ', katakana: 'ュ'},
      {hits: 0, misses: 0, german: 'yo', hiragana: 'ょ', katakana: 'ョ'}
    ],
    small_aeio: [
      {hits: 0, misses: 0, german: 'a', hiragana: 'ァ', katakana: 'ァ'},
      {hits: 0, misses: 0, german: 'i', hiragana: 'ィ', katakana: 'ィ'},
      {hits: 0, misses: 0, german: 'e', hiragana: 'ェ', katakana: 'ェ'},
      {hits: 0, misses: 0, german: 'o', hiragana: 'ォ', katakana: 'ォ'}
    ],
    choonpu: [
      {hits: 0, misses: 0, german: 'ー', hiragana: 'ー', katakana: 'ー'}
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
  hits: number;
  misses: number
}