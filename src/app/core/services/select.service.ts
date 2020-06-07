import { Injectable, InjectionToken, Inject } from '@angular/core';
import { Card } from '../entities/card';
import { CardService } from './card.service';
import { CardInterface } from '../entities/card-interface';

export const SESSION_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => (typeof window !== 'undefined') ? window.sessionStorage : null
});

@Injectable({
  providedIn: 'root'
})
export class SelectService {

  private _cards: Array<CardInterface> = [];

  get cards() {
    return this._cards;
  }

  constructor(private cardService: CardService, @Inject(SESSION_STORAGE) private sessionStorage) {
    this.loadSessionStorage();
  }

  addCard(card: CardInterface) {
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
    if (this.sessionStorage) {
      try {
        const uids = JSON.parse(this.sessionStorage.getItem('selection'));
        uids.forEach(uid => {
          this.cardService.get(uid).snapshotChanges().subscribe(data => {
            const card = Card.createFromCardInterface(data.payload.data());
            card.uid = data.payload.id;
            this._cards.push(card);
          })
        });

      } catch (error) {
        console.log(error);
      }
    }
  }
}
