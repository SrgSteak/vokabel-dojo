import { Card as CardInterface } from '../services/card.service';

export class Card implements CardInterface {
  uid?: string;
  german?: string;
  romaji?: string;
  hiragana?: string;
  katakana?: string;
  kanji?: string;       // 月
  reading?: string;
  chinese_readings?: Array<string>; // ゲツ、ガツ
  japanese_readings?: Array<string>; // つき
  examples?: Array<string>; // card ids, Mond, readings
  createdAt?: Date;
  updatedAt?: Date;
  decks?: string[];
  hits?: number;
  misses?: number;

  constructor() {
    this.hits = 0;
    this.misses = 0;
    this.reading = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.decks = [];
  }

  getReading(mode: string): string {
    if (this[mode]) {
      return this[mode];
    }
    if (this['kanji']) {
      return this['kanji'];
    }
    if (this['hiragana']) {
      return this['hiragana'];
    }
    if (this['katakana']) {
      return this['katakana'];
    }
    if (this['romaji']) {
      return this['romaji'];
    }
    return '';
  }

  static createFromCardInterface(cardInterface: CardInterface) {
    const card = new Card();
    card.createdAt = cardInterface.createdAt;
    card.updatedAt = cardInterface.updatedAt;
    card.uid = cardInterface.uid;
    card.hiragana = cardInterface.hiragana;
    card.katakana = cardInterface.katakana;
    card.kanji = cardInterface.kanji;
    card.german = cardInterface.german;
    card.romaji = cardInterface.romaji;
    card.decks = cardInterface.decks;
    card.hits = cardInterface.hits;
    card.misses = cardInterface.misses;
    card.japanese_readings = cardInterface.japanese_readings;
    card.chinese_readings = cardInterface.chinese_readings;
    return card;
  }
}