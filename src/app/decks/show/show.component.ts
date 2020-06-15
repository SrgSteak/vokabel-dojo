import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeckService, Deck } from 'src/app/core/services/deck.service';
import { CardService } from 'src/app/core/services/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, User } from 'src/app/core/auth.service';
import { Card } from 'src/app/core/entities/card';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-deck-public-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit, OnDestroy {

  cards = [];
  deck: Deck;
  mode: string;
  allowEdit = false;
  showSubmenu = false;
  user: User;

  userSub: Subscription;
  routeSub: Subscription;
  cardSub: Subscription;
  deckSub: Subscription;
  authSub: Subscription;

  constructor(
    private deckService: DeckService,
    private cardService: CardService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private title: Title) { }

  ngOnInit() {
    this.userSub = this.auth.user.subscribe(user => {
      if (user) {
        this.user = user;
        this.allowEdit = user.role === 'admin';
      }
    });
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.mode = params.get('mode');
      this.deckSub = this.deckService.get(params.get('uid')).valueChanges().subscribe(data => {
        this.deck = data;
        this.title.setTitle('Vokabeldojo | ' + this.deck.name);
        this.deck.uid = params.get('uid');
      });
      this.cardSub = this.cardService.loadForDeckUid(params.get('uid')).subscribe(cards => {
        this.cards = cards;
      });
    });
  }

  ngOnDestroy() {
    if (this.cardSub) { this.cardSub.unsubscribe(); }
    if (this.deckSub) { this.deckSub.unsubscribe(); }
    if (this.routeSub) { this.routeSub.unsubscribe(); }
    if (this.userSub) { this.userSub.unsubscribe(); }
    if (this.authSub) { this.authSub.unsubscribe(); }
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
      const addSub = this.deckService.copyDeckForUser(this.deck, this.user.uid).then(reference => {
        this.deckService.copyCardsIntoDeck(this.deck, this.user.uid, reference.id);
        this.router.navigate(['/', 'decks', reference.id]);
      });
    }
  }
}
