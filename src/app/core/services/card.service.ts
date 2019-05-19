import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { wordFlashcard } from 'src/app/interfaces/word-flashcard.interface';
import { User } from '../auth.service';
import { Deck } from './deck.service';

export interface Card extends wordFlashcard {
  uid?: string;
  german?: string;      // the german meaning
  romaji?: string;      // the romaji writing
  hiragana?: string;    // the hiragana writing
  katakana?: string;    // the katakana writing
  kanji?: string;       // the kanji writing      人
  reading?: string;     // the reading of the word
  chinese_readings?: Array<string>; // the chinese readings of the kanji
  japanese_readings?: Array<string>; // the japanese readings of the kanji
  examples?: Array<string>; // ids to other cards that use this kanji.
  createdAt?: Date;     // date of creation
  updatedAt?: Date;     // date of last edit
  decks?: Array<string>;  // relation to decks
}

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private afs: AngularFirestore) { }

  get(id: string, deck_id?: string, user_id?: string) {
    if (deck_id && user_id) {
      return this.afs.collection('users').doc(user_id).collection('Decks').doc(deck_id).collection('Cards').doc<Card>(id);
    } else {
      return this.afs.collection('Cards').doc<Card>(id);
    }
  }

  /**
   * TODO: provide deck and user in users components!
   * @param card New Card to add to Database
   * @param deck
   * @param user
   */
  add(card: Card, deck?: Deck, user?: User) {
    card.createdAt = new Date();
    card.updatedAt = new Date();
    if (user) {
      this.afs.collection('users').doc(user.uid).collection('Decks').doc(deck.uid).collection('Cards').add(card);
    } else {
      this.afs.collection('Cards').add(card);
    }
  }

  update(card: Card, deck?: string, user?: string) {
    card.updatedAt = new Date();
    if (user) {
      this.afs.collection('users').doc(user).collection('Decks').doc(deck).collection('Cards').doc(card.uid).set(card, { merge: true });
    }
    this.afs.collection('Cards').doc(card.uid).set(card, { merge: true });
  }

  delete(id: string) {
    this.afs.collection('Cards').doc(id).delete();
  }

  loadAll() {
    return this.afs.collection(
      'Cards',
      ref => ref.orderBy('createdAt', 'desc')
    );
  }

  loadForDeck(deck: string) {
    return this.afs.firestore.collection('Cards').orderBy('createdAt').where('decks', 'array-contains', deck);
  }
}
