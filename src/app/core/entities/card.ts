import { SnapshotOptions, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { CardInterface } from "./card-interface";
import { WordType, VerbType, AdjectiveType, VerbContext } from './card-type';

export const cardConverter = {
  toFirestore(card: Card): DocumentData {
    if (card.author == undefined || card.author == null) {
      card.author = '';
    }
    return card;
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Card {
    const card = Card.createFromCardInterface(snapshot.data(options)! as CardInterface);
    card.uid = snapshot.id;
    return card;
  }
}

export class Card implements CardInterface {
  uid?: string;
  wordType?: WordType;
  verbType?: VerbType;
  verbContext?: VerbContext;
  adjectiveType?: AdjectiveType;
  german?: Array<string>;
  japanese: string;
  _reading: string;
  chinese_readings?: Array<string>; // ゲツ、ガツ
  japanese_readings?: Array<string>; // つき
  examples?: [{
    japanese?: string;                // あの人
    reading?: string;                 // あのひと
    german?: string;                  // diese Person
  }];
  createdAt?: Date;
  updatedAt?: Date;
  decks?: Array<{ name: string; uid: string }>;
  deck_uids?: Array<string>;
  hits?: number;
  misses?: number;
  author?: string;

  get reading() {
    if (this._reading != null && this._reading.length > 0) {
      return this._reading;
    }
    if (this.hasJapReadings()) {
      return this.japanese_readings[0];
    } else if (this.hasChineseReadings()) {
      return this.chinese_readings[0];
    }
    return '';
  }

  set reading(text: string) {
    this._reading = text;
  }

  constructor() {
    this.author = '';
    this.hits = 0;
    this.misses = 0;
    this.reading = '';
    this.german = [];
    this.japanese = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.decks = [];
    this.deck_uids = [];
  }

  getReading(): string {
    if (this.reading) {
      return this.reading;
    } else if (this.hasJapReadings()) {
      return this.japanese_readings[0];
    } else if (this.hasChineseReadings()) {
      return this.chinese_readings[0];
    }
    return '';
  }

  getGerman(): string {
    if (this.german && this.german[0] !== null && this.german[0] !== undefined) {
      return this.german[0];
    }
    return '';
  }

  hasGerman() {
    return this.getGerman() !== '';
  }
  hasExamples() {
    return this.examples && this.examples[0] !== '' && this.examples[0] !== undefined;
  }

  hasReadings() {
    return this.hasJapReadings() || this.hasChineseReadings();
  }
  hasJapReadings() {
    return this.japanese_readings.length && (this.japanese_readings[0] !== null || this.japanese_readings[0] !== '');
  }
  hasChineseReadings() {
    return this.chinese_readings.length && (this.chinese_readings[0] !== null || this.chinese_readings[0] !== '');
  }
  hasOnlyOneReading() {
    if (this.hasJapReadings() && this.hasChineseReadings()) {
      return false;
    }

    if (this.hasJapReadings()) {
      return this.japanese_readings.length < 2;
    }
    if (this.hasChineseReadings()) {
      return this.chinese_readings.length < 2;
    }

    return false;
  }

  static createFromCardInterface(cardInterface: CardInterface) {
    const card = new Card();
    for (const property in cardInterface) {
      if (cardInterface.hasOwnProperty(property)) {
        if (property != 'decks') {
          card[property] = cardInterface[property];
        }
      }
    }

    // helper
    if (!card.japanese) {
      if (cardInterface['hiragana']) {
        card.japanese = cardInterface['hiragana'];
      }
      if (cardInterface['katakana']) {
        card.japanese = cardInterface['katakana'];
      }
      if (cardInterface['kanji']) {
        card.japanese = cardInterface['kanji'];
      }
    }

    card.german = Array.isArray(cardInterface.german) ? cardInterface.german : [cardInterface.german];
    if (cardInterface.decks) {
      card.decks = card.decks.concat(cardInterface.decks);
    }
    card.japanese_readings = cardInterface.japanese_readings;
    if (!card.japanese_readings) {
      card.japanese_readings = [];
    }
    card.chinese_readings = cardInterface.chinese_readings;
    if (!card.chinese_readings) {
      card.chinese_readings = [];
    }
    return card;
  }

  isKanji() {
    return this.wordType === WordType.kanji;
  }

  isVerb() {
    return this.wordType === WordType.verb;
  }

  isGodanVerb() {
    return this.verbType === VerbType.five;
  }

  isIchidanVerb() {
    return this.verbType === VerbType.single;
  }

  isSuruVerb() {
    return this.verbType === VerbType.suru;
  }

  isIrregularVerb() {
    return this.verbType === VerbType.irregular;
  }

  isAdjective() {
    return this.wordType === WordType.adjective;
  }
}