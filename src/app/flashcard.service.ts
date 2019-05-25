import { Injectable } from '@angular/core';
import { flashcard } from './syllables.service';
import { CardInterface } from './core/entities/card-interface';

@Injectable()
export class FlashcardService {

  public totalHits = 0;
  public totalMisses = 0;
  private pushSubscription: PushSubscription;

  shuffle<T>(deck: Array<T>): Array<T> {
    let currentIndex = deck.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = deck[currentIndex];
      deck[currentIndex] = deck[randomIndex];
      deck[randomIndex] = temporaryValue;
    }
    return deck;
  }

  draw<T>(deck: Array<T>, number: number): Array<T> {
    const cards = [];
    for (let index = 0; index < number; index++) {
      if (deck[index]) {
        cards.push(deck[index]);
      }
    }
    return cards;
  }

  getCardsContaining(word: string, extras: number, fromDeck?: Array<string>) {
    const deck = [];
    let syllables = fromDeck ? fromDeck : [];
    word.split('').forEach((char: string) => {
      const syllable = syllables.find((card) => { return card === char });
      deck.push(syllable);
    });
    syllables = this.shuffle(syllables);
    for (let index = 0; index < extras; index++) {
      deck.push(syllables[index]);
    }
    return this.shuffle(deck);
  }

  createCharactersetFromCard(cards: Array<CardInterface>) {
    let collection = "";
    cards.forEach(card => {
      collection = collection + card.japanese;
    });
    return collection.split('');
  }

  resetStatistic() {
    this.totalHits = 0;
    this.totalMisses = 0;
  }

  setPushSubscription(sub: PushSubscription): void {
    this.pushSubscription = sub;
    this.pushSubscription
  }


}