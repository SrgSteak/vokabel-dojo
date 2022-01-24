import { Injectable } from '@angular/core';
import { CardService } from './card.service';
import { FlashcardService } from 'src/app/flashcard.service';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import _ from 'lodash';
import { collection, collectionData, doc, docData, docSnapshots, Firestore, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { deleteDoc, DocumentReference, DocumentSnapshot, limit, onSnapshot, Timestamp } from 'firebase/firestore';
import { deckConverter, DeckInterface } from '../entities/deck';

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

  private decks = new Map<string, any>();
  private ref = collection(this.afs, 'Decks');

  constructor(private readonly afs: Firestore, private cardService: CardService) {
    super();
  }

  get(id: string): Observable<Deck> {
    const ref = doc(this.afs, `Decks/${id}`);
    return (docData(ref, { idField: 'uid' }) as Observable<Deck>).pipe(
      distinctUntilChanged(
        (prev, curr) => { return _.isEqual(prev, curr) }
      )
    );
  }

  getDeck(uid: string): Observable<DeckInterface> {
    const ref = doc(this.afs, `Decks/${uid}`).withConverter(deckConverter);
    return docData(ref);
  }

  allPublicDecks(): Observable<Deck[]> {
    const q = query(this.ref, where('author', '==', ''), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'uid' }) as Observable<Deck[]>;
  }

  allDecksForUser(uid: string): Observable<DeckInterface[]> {
    const q = query(this.ref, where('author', '==', uid), orderBy('createdAt', 'desc')).withConverter(deckConverter);
    return collectionData(q, { idField: 'uid' });
  }

  findByName(name: string): Observable<Deck[]> {
    const q = query(this.ref, where('name', '>=', name), where('name', '<=', name + '\uf8ff'));
    return collectionData(q, { idField: 'uid' }) as Observable<Deck[]>;
  }

  findByNameForUser(user_uid: string, name: string): Observable<Deck[]> {
    const q = query(
      this.ref,
      where('author', '==', user_uid),
      where('name', '>=', name),
      where('name', '<=', name + '\uf8ff')
    );
    return collectionData(q, { idField: 'uid' }) as Observable<Deck[]>;
  }

  /**
   * used on the start page to display the newest content
   * @param numberResults limit number of results
   * @returns
   */
  findNewestPublicDecks(numberResults = 3): Observable<DeckInterface[]> {
    const q = query(this.ref, where('author', '==', ''), orderBy('updatedAt', 'desc'), limit(numberResults)).withConverter(deckConverter)
    return collectionData(q, { idField: 'uid' }) as Observable<DeckInterface[]>;
  }

  /**
   * used on the start page to display newest decks of the current user
   * @param user_uid users uid
   * @param numberResults number of results to display
   * @returns
   */
  findNewestDecksForUser(user_uid: string, numberResults = 3): Observable<DeckInterface[]> {
    const q = query(this.ref, where('author', '==', user_uid), orderBy('updatedAt', 'desc'), limit(numberResults)).withConverter(deckConverter)
    return collectionData(q, { idField: 'uid' }) as Observable<DeckInterface[]>;
  }

  copyDeckForUser(deck: DeckInterface, user_uid: string) {
    deck.author = user_uid;
    return this.add(deck);
  }

  copyCardsIntoDeck(origin_deck: DeckInterface, user_uid: string, deck_uid: string) {
    this.cardService.loadForDeckUid(origin_deck.uid).subscribe(cards => {
      cards.forEach(card => {
        card.deck_uids = [deck_uid];
        card.decks = [{ name: origin_deck.name, uid: deck_uid }]
        card.author = user_uid;
        this.cardService.add(card);
      });
    });
  }

  add(deck: DeckInterface): Promise<DocumentReference> {
    return new Promise((resolve, reject) => {
      const now = Date.now();
      deck.createdAt = new Timestamp(now / 1000, 0);
      deck.updatedAt = new Timestamp(now / 1000, 0);
      const ref = doc(this.ref);
      setDoc(ref, deck).then(() => {
        resolve(ref);
      });

    })
  }

  update(id: string, deck: Deck) {
    deck.updatedAt = new Date();
    return setDoc(doc(this.ref, deck.uid), deck, { merge: true });
  }

  write(deck: DeckInterface): Promise<DocumentReference> {
    return new Promise((resolve, reject) => {
      deck.updatedAt = new Timestamp(Date.now() / 1000, 0);
      const ref = deck.uid ? doc(this.ref, deck.uid) : doc(this.ref);
      setDoc(ref, deck).then(() => {
        console.log(ref);
        resolve(ref);
      }, (error) => {
        console.error('could not update Deck!', deck);
        console.error(error);
        reject(error);
      });
    });
  }

  delete(id: string) {
    return deleteDoc(doc(this.ref, id));
  }
}
