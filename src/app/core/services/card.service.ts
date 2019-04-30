import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { wordFlashcard } from 'src/app/interfaces/word-flashcard.interface';

export interface Card extends wordFlashcard {
  uid?: string;
  german: string;
  romaji?: string;
  hiragana?: string;
  katakana?: string;
  kanji?: string;
  createdAt?: Date;
  updatedAt?: Date;
  decks?: Array<string>;
}

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private afs: AngularFirestore) { }

  get(id: string) {
    return this.afs.collection('Cards').doc<Card>(id);
  }

  add(card: Card) {
    card.createdAt = new Date();
    card.updatedAt = new Date();
    this.afs.collection('Cards').add(card);
  }

  update(id: string, card: Card) {
    card.updatedAt = new Date();
    this.afs.collection('Cards').doc(id).set(card, { merge: true });
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
    return this.afs.firestore.collection('Cards').where('decks', 'array-contains', deck);
  }
}
