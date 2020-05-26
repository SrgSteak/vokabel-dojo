import { Component, OnInit } from '@angular/core';
import { DeckService, Deck } from 'src/app/core/services/deck.service';
import { CardService } from 'src/app/core/services/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, User } from 'src/app/core/auth.service';
import { Card } from 'src/app/core/entities/card';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-deck-public-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {

  cards = [];
  oldCards = [];
  deck: Deck;
  mode: string;
  allowEdit = false;
  showSubmenu = false;
  user: User;

  constructor(
    private deckService: DeckService,
    private cardService: CardService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private title: Title) { }

  ngOnInit() {
    this.auth.user.subscribe(user => {
      if (user) {
        this.user = user;
        this.allowEdit = user.role === 'admin';
      }
    });
    this.route.paramMap.subscribe(params => {
      this.mode = params.get('mode');
      this.cardService.loadForDeckLegacy(params.get('uid')).get().then(data => {
        this.oldCards = data.docs.map(e => {
          const card = Card.createFromCardInterface(e.data() as CardInterface);
          card.uid = e.id;
          return card;
        })
      });
      this.deckService.get(params.get('uid')).valueChanges().subscribe(data => {
        this.deck = data;
        this.title.setTitle('Vokabeldojo | ' + this.deck.name);
        this.deck.uid = params.get('uid');
        this.cardService.loadForDeck(this.deck.name, this.deck.uid).get().then(data => {
          this.cards = data.docs.map(e => {
            const card = Card.createFromCardInterface(e.data() as CardInterface);
            card.uid = e.id;
            return card;
          })
        });
      });
    });
  }

  addCard(card: CardInterface) {
    this.cards.push(card);
    this.cardService.add(card, this.deck);
  }

  editMe(card: CardInterface) {
    if (this.allowEdit) {
      this.router.navigate(['/', 'cards', 'edit', card.uid]);
    }
  }

  /**
   * TODO: add loading indicator, show copy progress, redirect
   */
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
