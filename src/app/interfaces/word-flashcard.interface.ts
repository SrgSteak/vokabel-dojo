import { flashcard } from './flashcard.interface';

export interface wordFlashcard extends flashcard {
  hiragana?: string;
  kanji?: string;
}