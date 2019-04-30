import { Component, OnInit } from '@angular/core';
import { DeckService, Deck } from 'src/app/core/services/deck.service';
import { CardService, Card } from 'src/app/core/services/card.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {

  cards = [];
  deck: Deck;
  mode: string;
  constructor(private deckService: DeckService, private cardService: CardService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.mode = params.get('mode');
      this.cardService.loadForDeck(params.get('uid')).get().then(data => {
        this.cards = data.docs.map(e => {
          const card = e.data();
          card.uid = e.id;
          return card;
        })
      });
      this.deckService.get(params.get('uid')).snapshotChanges().subscribe(data => {
        this.deck = data.payload.data();
        this.deck.uid = data.payload.id;
      });
    });
  }

  addCard(card: Card) {
    this.cards.push(card);
  }
}
