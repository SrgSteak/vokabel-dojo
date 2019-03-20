import { Injectable } from '@angular/core';

@Injectable()
export class FlashcardService {

  public totalHits = 0;
  public totalMisses = 0;

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

  resetStatistic() {
    this.totalHits = 0;
    this.totalMisses = 0;
  }
}