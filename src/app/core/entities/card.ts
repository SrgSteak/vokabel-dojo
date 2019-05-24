import { CardInterface } from "./card-interface";

export class Card implements CardInterface {
  uid?: string;
  german?: Array<string>;
  japanese: string;
  reading?: string;
  chinese_readings?: Array<string>; // ゲツ、ガツ
  japanese_readings?: Array<string>; // つき
  examples?: [{
    japanese?: string;                // あの人
    reading?: string;                 // あのひと
    german?: string;                  // diese Person
  }];
  createdAt?: Date;
  updatedAt?: Date;
  decks?: string[];

  hits?: number;
  misses?: number;

  constructor() {
    this.hits = 0;
    this.misses = 0;
    this.reading = '';
    this.german = [];
    this.japanese = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.decks = [];
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
        card[property] = cardInterface[property];
      }
    }

    card.german = Array.isArray(cardInterface.german) ? cardInterface.german : [cardInterface.german];
    card.decks = cardInterface.decks;
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
}