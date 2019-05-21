import { CardInterface } from "./card-interface";

export class Card implements CardInterface {
  uid?: string;
  german?: Array<string>;
  japanese?: string;
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

  getReading(mode: string): string {
    if (this.reading) {
      return this.reading;
    } else if (this.japanese_readings) {
      return this.japanese_readings[0];
    } else if (this.chinese_readings) {
      return this.chinese_readings[0];
    }
    return '';
  }

  getGerman(): string {
    if (this.german) {
      return this.german[0];
    }
    return '';
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