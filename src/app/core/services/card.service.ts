import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CardInterface } from '../entities/card-interface';
import { Card } from '../entities/card';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private afs: AngularFirestore) { }

  get(id: string) {
    return this.afs.collection('Cards').doc<CardInterface>(id);
  }

  getCard(uid: string): Observable<Card> {
    return this.afs.collection('Cards').doc<CardInterface>(uid).snapshotChanges().pipe(
      distinctUntilChanged(
        (prev, curr) => _.isEqual(prev?.payload.data(), curr?.payload.data())
      ),
      map(cardInterface => {
        const card = Card.createFromCardInterface(cardInterface.payload.data());
        card.uid = cardInterface.payload.id;
        return card;
      })
    );
  }

  /**
   * get all cards that are found with the given uid array
   * @param uids
   */
  getMultiple(uids: Array<string>) {
    return this.afs.collection<Card>(
      'Cards',
      ref => ref.orderBy('createdAt', 'desc').where('uid', 'in', uids)
    ).valueChanges({ idField: 'uid' }).pipe(map(cardinterfaces => {
      const cards = [];
      cardinterfaces.forEach(_cardInterface => {
        cards.push(Card.createFromCardInterface(_cardInterface));
      })
      return cards;
    }));
  }

  /**
   * @param card New Card to add to Database
   */
  add(card: CardInterface) {
    card.createdAt = new Date();
    card.updatedAt = new Date();
    this.afs.collection('Cards').add(Object.assign({}, card));
  }

  /**
   * updates a card in the db with the cards.uid
   * @param card
   */
  update(card: CardInterface) {
    card.updatedAt = new Date();
    try {
      this.afs.collection('Cards').doc(card.uid).set(Object.assign({}, card), { merge: true });
    } catch (e) {
      console.error(e);
      console.log(card);
    }
  }

  delete(id: string) {
    this.afs.collection('Cards').doc(id).delete();
  }

  loadAll() {
    return this.afs.collection<Card>(
      'Cards',
      ref => ref.orderBy('createdAt', 'desc')
    );
  }

  /**
   * observable of all public (author == '') cards
   */
  allPublicCards(): Observable<Array<CardInterface>> {
    return this.afs.collection<CardInterface>(
      'Cards',
      ref => ref.orderBy('createdAt', 'desc').where('author', '==', '')
    ).valueChanges({ idField: 'uid' });
  }

  /**
   * observable of all user (author == uid) cards
   * @param uid the uid of the given user
   */
  allCardsForUser(uid: string): Observable<Array<CardInterface>> {
    return this.afs.collection<CardInterface>(
      'Cards',
      ref => ref.orderBy('createdAt', 'desc').where('author', '==', uid)
    ).valueChanges({ idField: 'uid' });
  }

  /**
   * loads all cards that are in the given deck uid. should replace "loadForDeck"
   * @param uid the uid of the deck
   */
  loadForDeckUid(uid: string): Observable<Array<Card>> {
    return this.afs.collection<CardInterface>(
      'Cards',
      ref => ref.orderBy('createdAt', 'desc').where('deck_uids', 'array-contains', uid)
    ).valueChanges({ idField: 'uid' }).pipe(map(cardinterfaces => {
      const cards = [];
      cardinterfaces.forEach(_cardInterface => {
        cards.push(Card.createFromCardInterface(_cardInterface));
      })
      return cards;
    }));
  }

  deleteForUser(uid: string) {
    const sub = this.allCardsForUser(uid).subscribe(cards => {
      if (sub) { sub.unsubscribe(); }
      cards.forEach(_card => {
        console.log('deleting', _card);
        this.delete(_card.uid);
      })
    })
  }

  deleteForDeck(deckUid: string) {
    const sub = this.loadForDeckUid(deckUid).subscribe(cards => {
      if (sub) { sub.unsubscribe(); }
      cards.forEach(card => {
        this.delete(card.uid);
      });
    });
  }
}
