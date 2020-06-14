import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CardService } from './card.service';
import { FlashcardService } from 'src/app/flashcard.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../auth.service';
import { Card } from '../entities/card';

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
    return this.afs.collection<Deck>('Decks').doc<Deck>(id);
  }

  allPublicDecks(): Observable<Array<Deck>> {
    return this.afs.collection<Deck>(
      'Decks',
      ref => ref.orderBy('createdAt', 'desc').where('author', '==', '')
    ).valueChanges({ idField: 'uid' })
  }

  allDecksForUser(uid: string): Observable<Array<Deck>> {
    return this.afs.collection<Deck>(
      'Decks',
      ref => ref.orderBy('createdAt', 'desc').where('author', '==', uid)
    ).valueChanges({ idField: 'uid' })
  }

  findByName(name: string): Observable<Array<Deck>> {
    return this.afs.collection<Deck>(
      'Decks',
      ref => ref.orderBy('name').where('name', '>=', name).where('name', '<=', name + '\uf8ff')
    ).valueChanges({ idField: 'uid' })
  }

  getDeckForUser(deck_uid: string, user_uid: string) {
    return this.afs.collection('users').doc(user_uid).collection('Decks').doc<Deck>(deck_uid);
  }

  getCardsForDeck(deck_uid: string, user_uid: string) {
    return this.afs.collection('users').doc(user_uid).collection('Decks').doc(deck_uid).collection<Card>('Cards');
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
    // this.cardService.loadForDeck(origin_uid).get().then(data => {
    //   const cards = data.docs.map(e => {
    //     const card = e.data();
    //     card.uid = e.id;
    //     return card;
    //   });
    //   cards.forEach(card => {
    //     this.afs.collection('users').doc(user_uid).collection('Decks').doc(deck_uid).collection('Cards').add(card);
    //   });
    // });
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

  migrateUserDecks() {
    this.afs.collection<User>('users').valueChanges({ idField: 'uid' }).subscribe(_users => {
      _users.forEach(_user => {
        console.log('migrating decks for user: ', _user);
        this.afs.collection('users').doc(_user.uid).collection<Deck>('Decks').valueChanges({ idField: 'uid' }).subscribe(_user_decks => {
          _user_decks.forEach(_user_deck => {
            console.log('migrating deck', _user_deck);
            // migrate me to collection "Decks", add cards from this deck
            _user_deck.author = _user.uid;
            this.add(_user_deck).then(() => {
              console.log('migrated deck! starting cards');
              // now add all cards
              this.getCardsForDeck(_user_deck.uid, _user.uid).valueChanges({ idField: 'uid' }).subscribe(_cards => {
                _cards.forEach(_card => {
                  console.log('migrating card', _card);
                  _card.author = _user.uid;
                  _card.deck_uids = [_user_deck.uid];
                  _card.decks = [{ name: _user_deck.name, uid: _user_deck.uid }];
                  this.cardService.add(_card);
                })
              })
            });

          })
        });
      })
    });

  }
}
