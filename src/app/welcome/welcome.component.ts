import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Deck, DeckService } from '../core/services/deck.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  decks = [];
  constructor(public auth: AuthService, private deckService: DeckService, private title: Title) { }

  ngOnInit() {
    this.title.setTitle('Vokabeldojo | Home');
    this.auth.user.subscribe(user => {
      if (user) {
        this.deckService.getAllDecksForUser(user.uid).snapshotChanges().subscribe(res => {
          this.decks = res.map(deck => {
            const _deck = deck.payload.doc.data() as Deck;
            _deck.uid = deck.payload.doc.id;
            return _deck;
          });
        });
      }
    });
  }

}
