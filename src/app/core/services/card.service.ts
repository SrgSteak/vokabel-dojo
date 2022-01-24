import { Injectable } from '@angular/core';
import { CardInterface } from '../entities/card-interface';
import { Card, cardConverter } from '../entities/card';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import _ from 'lodash';
import { collection, collectionData, doc, docData, DocumentReference, Firestore, getDoc, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { deleteDoc, DocumentData, DocumentSnapshot, Query } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private ref = collection(this.afs, 'Cards');

  constructor(private readonly afs: Firestore) { }

  get(id: string): Observable<Card> {
    return docData(doc(this.afs, `Cards/${id}`)) as Observable<Card>;
  }

  getCard(uid: string): Observable<Card> {
    const docRef = doc(this.afs, `Cards/${uid}`).withConverter(cardConverter);
    return docData(docRef, { idField: 'uid' });
  }

  getCardOnce(uid: string): Promise<DocumentSnapshot<Card>> {
    const docRef = doc(this.afs, `Cards/${uid}`).withConverter(cardConverter);
    return getDoc(docRef);
  }

  /**
   * get all cards that are found with the given uid array
   * @param uids
   */
  getMultiple(uids: Array<string>): Observable<Card[]> {
    const q = query(this.ref, where('uid', 'in', uids));
    return collectionData(q, { idField: 'uid' }) as Observable<Card[]>;
    // return this.afs.collection<Card>(
    //   'Cards',
    //   ref => ref.orderBy('createdAt', 'desc').where('uid', 'in', uids)
    // ).valueChanges({ idField: 'uid' }).pipe(map(cardinterfaces => {
    //   const cards = [];
    //   cardinterfaces.forEach(_cardInterface => {
    //     cards.push(Card.createFromCardInterface(_cardInterface));
    //   })
    //   return cards;
    // }));
  }

  /**
   * @param card New Card to add to Database
   */
  add(card: CardInterface): Promise<DocumentReference> {
    return new Promise((resolve, reject) => {
      card.createdAt = new Date();
      card.updatedAt = new Date();
      const ref = doc(this.ref);
      setDoc(ref, Object.assign({}, card)).then(() => {
        resolve(ref);
      })
    });
  }

  /**
   * updates a card in the db with the cards.uid
   * @param card
   */
  update(card: CardInterface) {
    card.updatedAt = new Date();
    return setDoc(doc(this.ref, card.uid), Object.assign({}, card), { merge: true });
  }

  /**
   * saves a card to the document store.
   * Can be used to create or update entries.
   * @param card
   * @returns The document reference
   */
  write(card: CardInterface): Promise<DocumentReference> {
    return new Promise((resolve, reject) => {
      card.updatedAt = new Date();
      let ref: DocumentReference;
      if (card.uid) {
        ref = doc(this.ref, card.uid)
      } else {
        card.createdAt = new Date();
        ref = doc(this.ref);
      }
      setDoc(ref, Object.assign({}, card)).then(() => {
        resolve(ref);
      }, (error) => {
        console.error('could not write Card!', card);
        console.error(error);
        reject(error);
      })
    });
  }

  delete(id: string) {
    return deleteDoc(doc(this.ref, id));
  }

  loadAll(): Observable<CardInterface[]> {
    const q = query(this.ref, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'uid' }) as Observable<CardInterface[]>;
  }

  /**
   * observable of all public (author == '') cards
   */
  allPublicCards(): Observable<Array<CardInterface>> {
    const q = query(this.ref, where('author', '==', ''), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'uid' }) as Observable<CardInterface[]>;
  }

  /**
   * observable of all user (author == uid) cards
   * @param uid the uid of the given user
   */
  allCardsForUser(uid: string): Observable<Array<CardInterface>> {
    const q = query(this.ref, where('author', '==', uid), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'uid' }) as Observable<CardInterface[]>;
  }

  /**
   * loads all cards that are in the given deck uid. should replace "loadForDeck"
   * @param uid the uid of the deck
   */
  loadForDeckUid(uid: string): Observable<Card[]> {
    return (collectionData(this.queryForDeckUid(uid), { idField: 'uid' }) as Observable<CardInterface[]>).pipe(map(cardinterfaces => {
      const cards = [];
      cardinterfaces.forEach(_cardInterface => {
        cards.push(Card.createFromCardInterface(_cardInterface));
      })
      return cards;
    }));
  }

  queryForDeckUid(uid): Query<DocumentData> {
    const q = query(this.ref, where('deck_uids', 'array-contains', uid), orderBy('createdAt', 'desc'));
    return q;
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

  deleteForDeck(deckUid: string): Promise<null> {
    return new Promise((resolve, reject) => {
      const sub = this.loadForDeckUid(deckUid).subscribe(cards => {
        if (sub) { sub.unsubscribe(); }
        cards.forEach(card => {
          this.delete(card.uid);
        });
        resolve(null);
      });
    });
  }
}
