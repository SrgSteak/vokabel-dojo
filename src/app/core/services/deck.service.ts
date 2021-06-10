import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CardService } from './card.service';
import { FlashcardService } from 'src/app/flashcard.service';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { User } from '../auth.service';
import { Card } from '../entities/card';
import _ from 'lodash';

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

  constructor(private afs: AngularFirestore, private cardService: CardService) {
    super();
  }

  get(id: string) {
    if (this.decks.has(id)) {
      return of(this.decks.get(id));
    }
    return this.afs.collection<Deck>('Decks').doc<Deck>(id).valueChanges().pipe(
      distinctUntilChanged(
        (prev, curr) => { console.log(_.isEqual(prev, curr)); return _.isEqual(prev, curr) }
      ),
      tap(_deck => {
        if (_deck) {
          _deck.uid = id;
          this.decks.set(id, _deck);
        }
      })
    );
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

  findByNameForUser(user_uid: string, name: string) {
    return this.afs.collection<Deck>(
      'Decks',
      ref => ref.orderBy('name').where('author', '==', user_uid).where('name', '>=', name).where('name', '<=', name + '\uf8ff')
    ).valueChanges({ idField: 'uid' })
  }

  getCardsForDeck(deck_uid: string, user_uid: string) {
    return this.afs.collection('users').doc(user_uid).collection('Decks').doc(deck_uid).collection<Card>('Cards');
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

  add(deck: Deck) {
    deck.createdAt = new Date();
    deck.updatedAt = new Date();
    return this.afs.collection('Decks').add(deck);
  }

  update(id: string, deck: Deck) {
    deck.updatedAt = new Date();
    return this.afs.collection('Decks').doc(id).set(deck, { merge: true });
  }

  delete(id: string) {
    this.afs.collection('Decks').doc(id).delete();
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
