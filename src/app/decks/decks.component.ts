import { Component, OnInit } from '@angular/core';
import { DeckService, Deck } from '../core/services/deck.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss']
})
export class DecksComponent implements OnInit {

  decks = [];

  constructor(private DeckService: DeckService, private AuthService: AuthService) {
    DeckService.loadAll().snapshotChanges().subscribe(data => {
      this.decks = data.map(e => {
        const deck = e.payload.doc.data() as Deck;
        deck.uid = e.payload.doc.id;
        return deck;
      })
    });
  }

  ngOnInit() {
  }

  createDeck() {
    this.AuthService.user.subscribe(user => {
      this.DeckService.add({name: 'Deck ' + '', description: 'somedesc' + Math.random().toString(), author: user.uid});
    });
  }

  deleteDeck(deck: Deck) {
    this.DeckService.delete(deck.uid);
  }
}
