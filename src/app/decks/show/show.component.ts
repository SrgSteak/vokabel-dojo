import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeckService, Deck } from 'src/app/core/services/deck.service';
import { CardService } from 'src/app/core/services/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, User } from 'src/app/core/auth.service';
import { Card } from 'src/app/core/entities/card';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { SelectService } from 'src/app/core/services/select.service';
import { onSnapshot } from '@angular/fire/firestore';
import { DeckInterface } from 'src/app/core/entities/deck';
import { LEARNMODE_ANIMATION } from 'src/app/core/animations/modal.animation';
import { Learnmode } from 'src/app/learn/choose-mode/choose-mode.component';
import { MenuService } from 'src/app/shared/menu/menu.service';

@Component({
  selector: 'app-deck-public-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
  animations: [LEARNMODE_ANIMATION]
})
export class ShowComponent implements OnInit, OnDestroy {

  cards = [];
  deck: DeckInterface;
  mode: string;
  allowEdit = false;
  showSubmenu = false;
  showLearnmodeSelection = false;
  user: User;

  userSub: Subscription;
  routeSub: Subscription;
  cardSub: Subscription;
  deckSub: Subscription;
  authSub: Subscription;

  private queryUnsubFunc;

  constructor(
    private deckService: DeckService,
    private cardService: CardService,
    private selectService: SelectService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    protected menuService: MenuService,
    private title: Title) { }

  ngOnInit() {
    this.userSub = this.auth.user.subscribe(user => {
      if (user) {
        this.user = user;
        this.allowEdit = user.role === 'admin';
      }
      this.routeSub = this.route.paramMap.subscribe(params => {
        this.mode = params.get('mode');
        this.deckSub = this.deckService.getDeck(params.get('uid')).subscribe(data => {
          this.deck = data;
          this.title.setTitle('Vokabeldojo | ' + this.deck.name);
          this.deck.uid = params.get('uid');
        });
        this.queryUnsubFunc = onSnapshot(this.cardService.queryForDeckUid(params.get('uid'), user?.uid ? [user.uid, ''] : ['']), (querySnapshot) => {
          this.cards = querySnapshot.docs.map(doc => {
            const card = Card.createFromCardInterface(doc.data());
            card.uid = doc.id;
            return card;
          });
        });
      });
    });
  }

  ngOnDestroy() {
    if (this.queryUnsubFunc) { this.queryUnsubFunc(); }
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
    this.showSubmenu = false;
    if (confirm('Dieses Deck jetzt kopieren?')) {
      const addSub = this.deckService.copyDeckForUser(this.deck, this.user.uid).then(reference => {
        this.deckService.copyCardsIntoDeck(this.deck, this.user.uid, reference.id);
        this.router.navigate(['/', 'decks', reference.id]);
      });
    }
  }

  selectAll() {
    this.cards.forEach(_card => {
      this.selectService.addCard(_card);
    })
  }

  startLearnMode(mode: Learnmode) {
    this.showLearnmodeSelection = false;
    switch (mode) {
      case Learnmode.learn:
        this.router.navigate(['/', 'decks', this.deck.uid, 'learn']);
        break;
      case Learnmode.quiz:
        this.router.navigate(['/', 'decks', this.deck.uid, 'quiz']);
        break;
      case Learnmode.spell:
        this.router.navigate(['/', 'decks', this.deck.uid, 'grid']);
        break;
    }
  }

  closeToList() {
    this.router.navigate(['/', 'decks', this.deck.uid, 'list']);
  }
}
