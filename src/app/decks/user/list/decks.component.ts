import { Component, OnInit } from '@angular/core';
import { DeckService, Deck } from '../../../core/services/deck.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss']
})
export class DecksComponent implements OnInit {

  decks = [];

  constructor(DeckService: DeckService, AuthService: AuthService) {
    AuthService.user.subscribe(user => {
      DeckService.getAllDecksForUser(user.uid).snapshotChanges().subscribe(data => {
        this.decks = data.map(e => {
          const deck = e.payload.doc.data() as Deck;
          deck.uid = e.payload.doc.id;
          return deck;
        })
      });
    });
  }

  ngOnInit() {
  }
}
