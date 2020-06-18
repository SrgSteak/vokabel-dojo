import { CardType, WordType, VerbType, AdjectiveType } from "./card-type";

export interface CardInterface {
  author?: string,
  cardType: CardType, // simple flashcard or extended word type?
  wordType?: WordType, // extended card with a fixed word type
  verbType?: VerbType, // if the word type is verb, is it one-step or five-step?
  adjectiveType?: AdjectiveType, // if the word type is verb, is it one-step or five-step?
  uid?: string;                       // the document uid (useful for equal checks)
  german?: Array<string>;             // the german meaning(s)
  japanese?: string;                  // the lexikon main entry and the root word (e.g. "mouse" for "mice")
  reading?: string;                   // the reading of the word
  chinese_readings?: Array<string>;   // the chinese readings of the kanji
  japanese_readings?: Array<string>;  // the japanese readings of the kanji
  examples?: [{
    japanese?: string;                // あの人
    reading?: string;                 // あのひと
    german?: string;                  // diese Person
  }];
  createdAt?: Date;                   // date of creation
  updatedAt?: Date;                   // date of last edit
  decks?: Array<{ name: string; uid: string }>;              // relation to decks
  deck_uids?: Array<string>;
  hits?: number;
  misses?: number;
}