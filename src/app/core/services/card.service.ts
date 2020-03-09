import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../auth.service';
import { Deck } from './deck.service';
import { CardInterface } from '../entities/card-interface';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private afs: AngularFirestore) { }

  get(id: string, deck_id?: string, user_id?: string) {
    if (deck_id && user_id) {
      return this.afs.collection('users').doc(user_id).collection('Decks').doc(deck_id).collection('Cards').doc<CardInterface>(id);
    } else {
      return this.afs.collection('Cards').doc<CardInterface>(id);
    }
  }

  /**
   * TODO: provide deck and user in users components!
   * @param card New Card to add to Database
   * @param deck
   * @param user
   */
  add(card: CardInterface, deck?: Deck, user?: User) {
    card.createdAt = new Date();
    card.updatedAt = new Date();
    if (user) {
      this.afs.collection('users').doc(user.uid).collection('Decks').doc(deck.uid).collection('Cards').add(Object.assign({}, card));
    } else {
      this.afs.collection('Cards').add(Object.assign({}, card));
    }
  }

  update(card: CardInterface, deck?: string, user?: string) {
    card.updatedAt = new Date();
    if (user) {
      this.afs.collection('users').doc(user).collection('Decks').doc(deck).collection('Cards').doc(card.uid).set(Object.assign({}, card), { merge: true });
    }
    this.afs.collection('Cards').doc(card.uid).set(Object.assign({}, card), { merge: true });
  }

  delete(id: string, deck?: string, user?: string) {
    if (user) {
      this.afs.collection('users').doc(user).collection('Decks').doc(deck).collection('Cards').doc(id).delete();
    } else {
      this.afs.collection('Cards').doc(id).delete();
    }
  }

  loadAll() {
    return this.afs.collection(
      'Cards',
      ref => ref.orderBy('createdAt', 'desc')
    );
  }

  loadForDeck(deck: string, uid: string) {
    return this.afs.firestore.collection('Cards').orderBy('createdAt').where('decks', 'array-contains', { name: deck, uid: uid });
  }

  loadForDeckLegacy(uid: string) {
    return this.afs.firestore.collection('Cards').orderBy('createdAt').where('decks', 'array-contains', uid);
  }
}
