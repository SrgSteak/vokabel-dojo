import { Injectable } from '@angular/core';
import { FlashcardService } from './flashcard.service';
import { CardInterface } from './core/entities/card-interface';

@Injectable({
  providedIn: 'root',
})
export class SyllablesService extends FlashcardService {

  public syllables = {
    a: [
      { hits: 0, misses: 0, german: 'a', hiragana: 'あ', katakana: 'ア', uid: 1 },
      { hits: 0, misses: 0, german: 'i', hiragana: 'い', katakana: 'イ', uid: 2 },
      { hits: 0, misses: 0, german: 'u', hiragana: 'う', katakana: 'ウ', uid: 3 },
      { hits: 0, misses: 0, german: 'e', hiragana: 'え', katakana: 'エ', uid: 4 },
      { hits: 0, misses: 0, german: 'o', hiragana: 'お', katakana: 'オ', uid: 5 }
    ],

    k: [
      { hits: 0, misses: 0, german: 'ka', hiragana: 'か', katakana: 'カ', uid: 6 },
      { hits: 0, misses: 0, german: 'ki', hiragana: 'き', katakana: 'キ', uid: 7 },
      { hits: 0, misses: 0, german: 'ku', hiragana: 'く', katakana: 'ク', uid: 8 },
      { hits: 0, misses: 0, german: 'ke', hiragana: 'け', katakana: 'ケ', uid: 9 },
      { hits: 0, misses: 0, german: 'ko', hiragana: 'こ', katakana: 'コ', uid: 10 }
    ],

    s: [
      { hits: 0, misses: 0, german: 'sa', hiragana: 'さ', katakana: 'サ', uid: 11 },
      { hits: 0, misses: 0, german: 'shi', hiragana: 'し', katakana: 'シ', uid: 12 },
      { hits: 0, misses: 0, german: 'su', hiragana: 'す', katakana: 'ス', uid: 13 },
      { hits: 0, misses: 0, german: 'se', hiragana: 'せ', katakana: 'セ', uid: 14 },
      { hits: 0, misses: 0, german: 'so', hiragana: 'そ', katakana: 'ソ', uid: 15 }
    ],

    t: [
      { hits: 0, misses: 0, german: 'ta', hiragana: 'た', katakana: 'タ', uid: 16 },
      { hits: 0, misses: 0, german: 'chi', hiragana: 'ち', katakana: 'チ', uid: 17 },
      { hits: 0, misses: 0, german: 'tsu', hiragana: 'つ', katakana: 'ツ', uid: 18 },
      { hits: 0, misses: 0, german: 'te', hiragana: 'て', katakana: 'テ', uid: 19 },
      { hits: 0, misses: 0, german: 'to', hiragana: 'と', katakana: 'ト', uid: 20 }
    ],

    na: [
      { hits: 0, misses: 0, german: 'na', hiragana: 'な', katakana: 'ナ', uid: 21 },
      { hits: 0, misses: 0, german: 'ni', hiragana: 'に', katakana: 'ニ', uid: 22 },
      { hits: 0, misses: 0, german: 'nu', hiragana: 'ぬ', katakana: 'ヌ', uid: 23 },
      { hits: 0, misses: 0, german: 'ne', hiragana: 'ね', katakana: 'ネ', uid: 24 },
      { hits: 0, misses: 0, german: 'no', hiragana: 'の', katakana: 'ノ', uid: 25 }
    ],

    h: [
      { hits: 0, misses: 0, german: 'ha', hiragana: 'は', katakana: 'ハ', uid: 26 },
      { hits: 0, misses: 0, german: 'hi', hiragana: 'ひ', katakana: 'ヒ', uid: 27 },
      { hits: 0, misses: 0, german: 'fu', hiragana: 'ふ', katakana: 'フ', uid: 28 },
      { hits: 0, misses: 0, german: 'he', hiragana: 'へ', katakana: 'ヘ', uid: 29 },
      { hits: 0, misses: 0, german: 'ho', hiragana: 'ほ', katakana: 'ホ', uid: 30 }
    ],

    m: [
      { hits: 0, misses: 0, german: 'ma', hiragana: 'ま', katakana: 'マ', uid: 31 },
      { hits: 0, misses: 0, german: 'mi', hiragana: 'み', katakana: 'ミ', uid: 32 },
      { hits: 0, misses: 0, german: 'mu', hiragana: 'む', katakana: 'ム', uid: 33 },
      { hits: 0, misses: 0, german: 'me', hiragana: 'め', katakana: 'メ', uid: 34 },
      { hits: 0, misses: 0, german: 'mo', hiragana: 'も', katakana: 'モ', uid: 35 }
    ],

    y: [
      { hits: 0, misses: 0, german: 'ya', hiragana: 'や', katakana: 'ヤ', uid: 36 },
      { hits: 0, misses: 0, german: 'yu', hiragana: 'ゆ', katakana: 'ユ', uid: 37 },
      { hits: 0, misses: 0, german: 'yo', hiragana: 'よ', katakana: 'ヨ', uid: 38 }
    ],

    r: [
      { hits: 0, misses: 0, german: 'ra', hiragana: 'ら', katakana: 'ラ', uid: 39 },
      { hits: 0, misses: 0, german: 'ri', hiragana: 'り', katakana: 'リ', uid: 40 },
      { hits: 0, misses: 0, german: 'ru', hiragana: 'る', katakana: 'ル', uid: 41 },
      { hits: 0, misses: 0, german: 're', hiragana: 'れ', katakana: 'レ', uid: 42 },
      { hits: 0, misses: 0, german: 'ro', hiragana: 'ろ', katakana: 'ロ', uid: 43 }
    ],

    w: [
      { hits: 0, misses: 0, german: 'wa', hiragana: 'わ', katakana: 'ワ', uid: 44 },
      { hits: 0, misses: 0, german: 'wo', hiragana: 'を', katakana: 'ヲ', uid: 45 }
    ],

    n: [
      { hits: 0, misses: 0, german: 'n', hiragana: 'ん', katakana: 'ン', uid: 46 }
    ],

    dakuten_h: [
      { hits: 0, misses: 0, german: 'ba', hiragana: 'ば', katakana: 'バ', uid: 47 },
      { hits: 0, misses: 0, german: 'bi', hiragana: 'び', katakana: 'ビ', uid: 48 },
      { hits: 0, misses: 0, german: 'bu', hiragana: 'ぶ', katakana: 'ブ', uid: 49 },
      { hits: 0, misses: 0, german: 'be', hiragana: 'べ', katakana: 'ベ', uid: 50 },
      { hits: 0, misses: 0, german: 'bo', hiragana: 'ぼ', katakana: 'ボ', uid: 51 }
    ],
    dakuten_k: [
      { hits: 0, misses: 0, german: 'ga', hiragana: 'が', katakana: 'ガ', uid: 52 },
      { hits: 0, misses: 0, german: 'gi', hiragana: 'ぎ', katakana: 'ギ', uid: 53 },
      { hits: 0, misses: 0, german: 'gu', hiragana: 'ぐ', katakana: 'グ', uid: 54 },
      { hits: 0, misses: 0, german: 'ge', hiragana: 'げ', katakana: 'ゲ', uid: 55 },
      { hits: 0, misses: 0, german: 'go', hiragana: 'ご', katakana: 'ゴ', uid: 56 }
    ],
    dakuten_t: [
      { hits: 0, misses: 0, german: 'da', hiragana: 'だ', katakana: 'ダ', uid: 57 },
      { hits: 0, misses: 0, german: 'ji', hiragana: 'ぢ', katakana: 'ヂ', uid: 58 },
      { hits: 0, misses: 0, german: 'zu', hiragana: 'づ', katakana: 'ヅ', uid: 59 },
      { hits: 0, misses: 0, german: 'de', hiragana: 'で', katakana: 'デ', uid: 60 },
      { hits: 0, misses: 0, german: 'do', hiragana: 'ど', katakana: 'ド', uid: 61 }
    ],
    dakuten_s: [
      { hits: 0, misses: 0, german: 'za', hiragana: 'ざ', katakana: 'ザ', uid: 62 },
      { hits: 0, misses: 0, german: 'ji', hiragana: 'じ', katakana: 'ジ', uid: 63 },
      { hits: 0, misses: 0, german: 'zu', hiragana: 'ず', katakana: 'ズ', uid: 64 },
      { hits: 0, misses: 0, german: 'ze', hiragana: 'ぜ', katakana: 'ゼ', uid: 65 },
      { hits: 0, misses: 0, german: 'zo', hiragana: 'ぞ', katakana: 'ゾ', uid: 66 },
    ],
    handakuten_h: [
      { hits: 0, misses: 0, german: 'pa', hiragana: 'ぱ', katakana: 'パ', uid: 67 },
      { hits: 0, misses: 0, german: 'pi', hiragana: 'ぴ', katakana: 'ピ', uid: 68 },
      { hits: 0, misses: 0, german: 'pu', hiragana: 'ぷ', katakana: 'プ', uid: 69 },
      { hits: 0, misses: 0, german: 'pe', hiragana: 'ぺ', katakana: 'ペ', uid: 70 },
      { hits: 0, misses: 0, german: 'po', hiragana: 'ぽ', katakana: 'ポ', uid: 71 }
    ],
    small_tsu: [
      { hits: 0, misses: 0, german: 'tsu', hiragana: 'っ', katakana: 'ッ', uid: 72 }
    ],
    small_ya_yu_yo: [
      { hits: 0, misses: 0, german: 'ya', hiragana: 'ゃ', katakana: 'ャ', uid: 73 },
      { hits: 0, misses: 0, german: 'yu', hiragana: 'ゅ', katakana: 'ュ', uid: 74 },
      { hits: 0, misses: 0, german: 'yo', hiragana: 'ょ', katakana: 'ョ', uid: 75 }
    ],
    small_aeio: [
      { hits: 0, misses: 0, german: 'a', hiragana: 'ァ', katakana: 'ァ', uid: 76 },
      { hits: 0, misses: 0, german: 'i', hiragana: 'ィ', katakana: 'ィ', uid: 77 },
      { hits: 0, misses: 0, german: 'e', hiragana: 'ェ', katakana: 'ェ', uid: 78 },
      { hits: 0, misses: 0, german: 'o', hiragana: 'ォ', katakana: 'ォ', uid: 79 }
    ],
    choonpu: [
      { hits: 0, misses: 0, german: 'ー', hiragana: 'ー', katakana: 'ー', uid: 80 }
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

  getCardsContaining(word: string, extras: number, fromDeck?: Array<string>) {
    const deck = [];
    let syllables = fromDeck ? fromDeck : this.getAll();
    word.split('').forEach((char: string) => {
      const syllable = syllables.find((card) => { return card === char });
      deck.push(syllable);
    });
    syllables = this.shuffle(syllables);
    for (let index = 0; index < extras; index++) {
      deck.push(syllables[index]);
    }
    return this.shuffle(deck);
  }

  createCharactersetFromCard(cards: Array<CardInterface>) {
    let collection = "";
    cards.forEach(card => {
      collection = collection + card.japanese;
    });
    return collection.split('');
  }
}

export interface flashcard {
  hiragana: string;
  katakana: string;
  german: string;
  hits: number;
  misses: number;
  uid: number;
}