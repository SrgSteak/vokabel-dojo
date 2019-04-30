import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Card } from './card.service';

export interface Deck {
  name: string;
  description: string;
  uid?: string;
  userCount?: number;
  cardCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  author: string;
}


@Injectable({
  providedIn: 'root'
})
export class DeckService {

  constructor(private afs: AngularFirestore) { }

  get(id: string) {
    return this.afs.collection('Decks').doc<Deck>(id);
  }

  getForUser(id: string) {
    return this
  }

  getForAuthor(id: string) {
    return this.afs.firestore.collection('Decks').where('author', '==', id);
  }

  add(deck: Deck) {
    deck.createdAt = new Date();
    deck.updatedAt = new Date();
    return this.afs.collection('Decks').add(deck);
  }

  addCard(deck: Deck, card: Card) {
    return this.afs.collection('Decks_Cards').doc(deck.uid + '_' + card.uid).set({ deck_id: deck.uid, card_id: card.uid}, {merge: true});
  }

  removeCard(deck: Deck, card: Card) {
    return this.afs.collection('Decks_Cards').doc(deck.uid + '_' + card.uid).delete();
  }

  update(id: string, deck: Deck) {
    deck.updatedAt = new Date();
    this.afs.collection('Decks').doc(id).set(deck, {merge: true});
  }

  delete(id: string) {
    this.afs.collection('Decks').doc(id).delete();
  }

  loadAll() {
    return this.afs.collection(
      'Decks',
      ref => ref.orderBy('createdAt', 'desc')
    );
  }
}
