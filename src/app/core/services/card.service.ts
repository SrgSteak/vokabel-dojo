import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../auth.service';
import { Deck } from './deck.service';
import { CardInterface } from '../entities/card-interface';
import { Card } from '../entities/card';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
      try {
        this.afs.collection('users').doc(user).collection('Decks').doc(deck).collection('Cards').doc(card.uid).set(Object.assign({}, card), { merge: true });
      } catch (e) {
        console.error(e);
        console.log(card);
      }
    }
    try {
      this.afs.collection('Cards').doc(card.uid).set(Object.assign({}, card), { merge: true });
    } catch (e) {
      console.error(e);
      console.log(card);
    }
  }

  delete(id: string, deck?: string, user?: string) {
    if (user) {
      this.afs.collection('users').doc(user).collection('Decks').doc(deck).collection('Cards').doc(id).delete();
    } else {
      this.afs.collection('Cards').doc(id).delete();
    }
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
  allPublicCards(): Observable<Array<Card>> {
    return this.afs.collection<Card>(
      'Cards',
      ref => ref.orderBy('createdAt', 'desc').where('author', '==', '')
    ).valueChanges({ idField: 'uid' });
  }

  /**
   * observable of all user (author == uid) cards
   * @param uid the uid of the given user
   */
  allCardsForUser(uid: string): Observable<Array<Card>> {
    return this.afs.collection<Card>(
      'Cards',
      ref => ref.orderBy('createdAt', 'desc').where('author', '==', uid)
    ).valueChanges({ idField: 'uid' });
  }

  loadForDeck(deck: string, uid: string) {
    return this.afs.firestore.collection('Cards').orderBy('createdAt').where('decks', 'array-contains', { name: deck, uid: uid });
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

  loadForDeckLegacy(uid: string) {
    return this.afs.firestore.collection('Cards').orderBy('createdAt').where('decks', 'array-contains', uid);
  }

  migrateAuthors() {
    const sub = this.loadAll().valueChanges({ idField: 'uid' }).subscribe(_cards => {
      //     console.log(_cards);
      sub.unsubscribe();
      _cards.forEach(_card => {
        console.log(_card);
        if (_card.author == undefined) {
          _card.author = '';
          this.update(_card);
        }
      });
    });
  }

  migrateUserCards() {

  }

  // migrateDeckIds() {
  //   const sub = this.loadAll().valueChanges({ idField: 'uid' }).subscribe(_cards => {
  //     console.log(_cards);
  //     sub.unsubscribe();
  //     _cards.forEach(_card => {
  //       const uids = [];
  //       _card.decks.forEach(_deck => {
  //         if (!_deck.uid) {
  //           uids.push(_deck);
  //         } else {
  //           uids.push(_deck.uid);
  //         }
  //       });
  //       _card.deck_uids = uids;
  //       try {
  //         this.update(_card);
  //       } catch (e) {
  //         console.log('cant update card: ' + _card.uid);
  //       }
  //     });
  //     console.log(_cards);
  //   });
  // }
  // migrateDeckIds() {
  //   this.loaddecks().valueChanges({ idField: 'uid' }).subscribe(_decks => {
  //     const sub = this.loadAll().valueChanges({ idField: 'uid' }).subscribe(_cards => {
  //       console.log(_cards);
  //       sub.unsubscribe();
  //       _cards.forEach(_card => {
  //         const uids = [];
  //         const decks = [];
  //         let updateMe = false;
  //         _card.decks.forEach(_deck => {
  //           if (!_deck.uid) { // deck is just a number
  //             updateMe = true;
  //             uids.push(_deck);
  //             const theDeck = _decks.find(__deck => __deck.uid === _deck as unknown as string);
  //             if (theDeck) {

  //               decks.push({ uid: theDeck.uid, name: theDeck.name });
  //             } else {
  //               updateMe = false;
  //             }
  //           }
  //         });
  //         _card.deck_uids = uids;
  //         _card.decks = decks;
  //         try {
  //           if (updateMe) {
  //             // console.log(_card);
  //             this.update(_card);
  //           }
  //         } catch (e) {
  //           console.log('cant update card: ' + _card.uid);
  //         }
  //       });
  //       console.log(_cards);
  //     });
  //   });
  // }

  // private loaddecks() {
  //   return this.afs.collection<Deck>(
  //     'Decks',
  //     ref => ref.orderBy('createdAt', 'desc')
  //   );
  // }
}
