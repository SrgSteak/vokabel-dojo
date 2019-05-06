import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Card, CardService } from './card.service';
import { FlashcardService } from 'src/app/flashcard.service';

export interface Deck {
  name: string;
  description: string;
  uid?: string;
  userCount?: number;
  cardCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  author: string;
  numberCards: number;
}


@Injectable({
  providedIn: 'root'
})
export class DeckService extends FlashcardService {

  constructor(private afs: AngularFirestore, private cardService: CardService) {
    super();
  }

  get(id: string) {
    return this.afs.collection('Decks').doc<Deck>(id);
  }

  getDeckForUser(deck_uid: string, user_uid: string) {
    return this.afs.collection('users').doc(user_uid).collection('Decks').doc<Deck>(deck_uid);
  }

  getCardsForDeck(deck_uid: string, user_uid: string) {
    return this.afs.collection('users').doc(user_uid).collection('Decks').doc(deck_uid).collection('Cards');
  }

  getAllDecksForUser(user_uid: string) {
    return this.afs.collection('users').doc(user_uid).collection('Decks');
  }

  publishDeck(deck: Deck) {
    return this.afs.collection('Decks').add(deck);
  }

  copyDeckForUser(deck: Deck, user_uid: string) {
    return this.afs.collection('users').doc(user_uid).collection('Decks').add(deck);
  }

  copyCardsIntoDeck(origin_uid: string, user_uid: string, deck_uid: string) {
    this.cardService.loadForDeck(origin_uid).get().then(data => {
      const cards = data.docs.map(e => {
        const card = e.data();
        card.uid = e.id;
        return card;
      });
      cards.forEach(card => {
        this.afs.collection('users').doc(user_uid).collection('Decks').doc(deck_uid).collection('Cards').add(card);
      });
    });
  }

  add(deck: Deck, user_uid?: string) {
    deck.createdAt = new Date();
    deck.updatedAt = new Date();
    if (user_uid) {
      return this.afs.collection('users').doc(user_uid).collection('Decks').add(deck);
    } else {
      return this.afs.collection('Decks').add(deck);
    }
  }

  update(id: string, deck: Deck, user_uid?: string) {
    deck.updatedAt = new Date();
    if (user_uid) {
      return this.afs.collection('users').doc(user_uid).collection('Decks').doc(id).set(deck, { merge: true });
    } else {
      return this.afs.collection('Decks').doc(id).set(deck, { merge: true });
    }
  }

  delete(id: string, user_uid?: string) {
    if (user_uid) {
      this.afs.collection('users').doc(user_uid).collection('Decks').doc(id).delete();
    } else {
      this.afs.collection('Decks').doc(id).delete();
    }
  }

  loadAll() {
    return this.afs.collection(
      'Decks',
      ref => ref.orderBy('createdAt', 'desc')
    );
  }
}
