import { Component, OnInit } from '@angular/core';
import { DeckService, Deck } from 'src/app/core/services/deck.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Card } from 'src/app/core/entities/card';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { CardService } from 'src/app/core/services/card.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {

  cards = [];
  deck: Deck;
  user: any;
  mode: string;
  showSubmenu = false;

  constructor(
    private deckService: DeckService,
    private cardService: CardService,
    private route: ActivatedRoute,
    private auth: AuthService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.mode = params.get('mode');
      this.auth.user.subscribe(user => {
        this.user = user;
        this.deckService.getCardsForDeck(params.get('uid'), user.uid).snapshotChanges().subscribe(data => {
          this.cards = data.map(e => {
            const card = Card.createFromCardInterface(e.payload.doc.data());
            card.uid = e.payload.doc.id;
            return card;
          });
        });
        this.deckService.getDeckForUser(params.get('uid'), user.uid).snapshotChanges().subscribe(data => {
          this.deck = data.payload.data();
          this.deck.uid = data.payload.id;
        });
      });
    });
  }

  addCard(card: CardInterface) {
    this.cards.push(card);
    this.cardService.add(card, this.deck, this.user);
  }

  addToCollection() {
    this.auth.user.subscribe(user => {
      this.deckService.copyDeckForUser(this.deck, user.uid);
    });
  }
}
