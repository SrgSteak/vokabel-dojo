import { Injectable, InjectionToken, Inject, EventEmitter } from '@angular/core';
import { CardService } from './card.service';
import { CardInterface } from '../entities/card-interface';
import { Subscription, forkJoin, Observable, zip } from 'rxjs';
import { Card } from '../entities/card';
import { DocumentSnapshot } from 'firebase/firestore';

export const SESSION_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => (typeof window !== 'undefined') ? window.sessionStorage : null
});

@Injectable({
  providedIn: 'root'
})
export class SelectService {
  loading = false;
  readonly loadedSelection = new EventEmitter<Array<Card>>();
  private _cards: Array<Card> = [];
  private cardSub: Subscription;

  get cards() {
    return this._cards;
  }

  constructor(private cardService: CardService, @Inject(SESSION_STORAGE) private sessionStorage) {
    this.loadSessionStorage();
  }

  addCard(card: Card) {
    if (!this._cards.some(_card => _card.uid === card.uid)) {
      this._cards.push(card);
      this.updateSessionStorage();
    }
  }

  removeCard(card: CardInterface) {
    this._cards = this._cards.filter(_card => _card.uid !== card.uid);
    this.updateSessionStorage();
  }

  clear() {
    this._cards = [];
    this.updateSessionStorage();
  }

  contains(card: CardInterface): boolean {
    return this._cards.some(_card => _card.uid === card.uid);
  }

  private updateSessionStorage() {
    const uids = [];
    this._cards.forEach(_card => {
      uids.push(_card.uid);
    });
    this.sessionStorage.setItem('selection', JSON.stringify(uids));
  }

  private loadSessionStorage() {
    if (this.sessionStorage && this.sessionStorage.getItem('selection')) {
      try {
        this.loading = true;
        const uids = JSON.parse(this.sessionStorage.getItem('selection'));
        const promises: Promise<DocumentSnapshot<Card>>[] = [];
        uids.forEach(uid => {
          console.log(uid);
          if (uid) {
            const p = this.cardService.getCardOnce(uid);
            promises.push(p);
          }
        });
        console.log(promises);
        forkJoin(promises).subscribe(_results => {
          console.log(_results);
          this._cards = _results.map(res => res.data());
          this.loadedSelection.emit(this._cards);
          this.loading = false;
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
