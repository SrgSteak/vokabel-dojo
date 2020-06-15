import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CardInterface } from '../entities/card-interface';
import { Card } from '../entities/card';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private afs: AngularFirestore) { }


  get(id: string) {
    return this.afs.collection('Cards').doc<CardInterface>(id);
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

  // migrateAuthors() {
  //   const sub = this.loadAll().valueChanges({ idField: 'uid' }).subscribe(_cards => {
  //     //     console.log(_cards);
  //     sub.unsubscribe();
  //     _cards.forEach(_card => {
  //       console.log(_card);
  //       if (_card.author == undefined) {
  //         _card.author = '';
  //         this.update(_card);
  //       }
  //     });
  //   });
  // }

  // migrateUserCards() {

  // }

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
