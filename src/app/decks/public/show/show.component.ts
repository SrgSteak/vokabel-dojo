import { Component, OnInit } from '@angular/core';
import { DeckService, Deck } from 'src/app/core/services/deck.service';
import { CardService } from 'src/app/core/services/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Card } from 'src/app/core/entities/card';
import { CardInterface } from 'src/app/core/entities/card-interface';

@Component({
  selector: 'app-deck-public-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {

  cards = [];
  deck: Deck;
  mode: string;
  allowEdit = false;
  showSubmenu = false;

  constructor(
    private deckService: DeckService,
    private cardService: CardService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService) { }

  ngOnInit() {
    this.auth.user.subscribe(user => {
      if (user) {
        this.allowEdit = user.role === 'admin';
      }
    });
    this.route.paramMap.subscribe(params => {
      this.mode = params.get('mode');
      this.cardService.loadForDeck(params.get('uid')).get().then(data => {
        this.cards = data.docs.map(e => {
          const card = Card.createFromCardInterface(e.data());
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

  addCard(card: CardInterface) {
    this.cards.push(card);
  }

  editMe(card: CardInterface) {
    if (this.allowEdit) {
      this.router.navigate(['/', 'cards', 'edit', card.uid]);
    }
  }

  addToCollection() {
    if (confirm('Dieses Deck jetzt kopieren?')) {
      this.auth.user.subscribe(user => {
        this.deckService.copyDeckForUser(this.deck, user.uid).then(reference => {
          this.deckService.copyCardsIntoDeck(this.deck.uid, user.uid, reference.id);
          this.router.navigate(['/', 'user', 'decks', reference.id]);
        });
      });
    }
  }
}
