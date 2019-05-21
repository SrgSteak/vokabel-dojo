export interface CardInterface {
  uid?: string;                       // the document uid (useful for equal checks)
  german?: Array<string>;             // the german meaning(s)
  japanese?: string;                  // the chinese writing. コーラ、ひと、人
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
  decks?: Array<string>;              // relation to decks

  hits?: number;
  misses?: number;
}