import { Injectable } from '@angular/core';
import { CardService } from './card.service';
import { FlashcardService } from 'src/app/flashcard.service';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import _ from 'lodash';
import { collection, collectionData, doc, docData, docSnapshots, Firestore, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { deleteDoc, DocumentReference, DocumentSnapshot, onSnapshot } from 'firebase/firestore';
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

  allDecksForUser(uid: string): Observable<Deck[]> {
    const q = query(this.ref, where('author', '==', uid), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'uid' }) as Observable<Deck[]>;
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

  copyDeckForUser(deck: Deck, user_uid: string) {
    deck.author = user_uid;
    return this.add(deck);
  }

  copyCardsIntoDeck(origin_deck: Deck, user_uid: string, deck_uid: string) {
    this.cardService.loadForDeckUid(origin_deck.uid).subscribe(cards => {
      cards.forEach(card => {
        card.deck_uids = [deck_uid];
        card.decks = [{ name: origin_deck.name, uid: deck_uid }]
        card.author = user_uid;
        this.cardService.add(card);
      });
    });
  }

  add(deck: Deck): Promise<DocumentReference> {
    return new Promise((resolve, reject) => {
      deck.createdAt = new Date();
      deck.updatedAt = new Date();
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
      deck.updatedAt = new Date();
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

  // migrateUserDecks() {
  //   this.afs.collection<User>('users').valueChanges({ idField: 'uid' }).subscribe(_users => {
  //     _users.forEach(_user => {
  //       console.log('migrating decks for user: ', _user);
  //       this.afs.collection('users').doc(_user.uid).collection<Deck>('Decks').valueChanges({ idField: 'uid' }).subscribe(_user_decks => {
  //         _user_decks.forEach(_user_deck => {
  //           console.log('migrating deck', _user_deck);
  //           // migrate me to collection "Decks", add cards from this deck
  //           _user_deck.author = _user.uid;
  //           this.add(_user_deck).then(() => {
  //             console.log('migrated deck! starting cards');
  //             // now add all cards
  //             this.getCardsForDeck(_user_deck.uid, _user.uid).valueChanges({ idField: 'uid' }).subscribe(_cards => {
  //               _cards.forEach(_card => {
  //                 console.log('migrating card', _card);
  //                 _card.author = _user.uid;
  //                 _card.deck_uids = [_user_deck.uid];
  //                 _card.decks = [{ name: _user_deck.name, uid: _user_deck.uid }];
  //                 this.cardService.add(_card);
  //               })
  //             })
  //           });

  //         })
  //       });
  //     })
  //   });

  // }
}
