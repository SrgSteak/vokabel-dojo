import { Component, OnInit } from '@angular/core';
import { DeckService, Deck } from '../../core/services/deck.service';
import { AuthService, User } from '../../core/auth.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-deck-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  decks = [];
  displayPublic = true;
  user: User;
  routeSub: Subscription;
  authSub: Subscription;
  deckSub: Subscription;
  publicDeckSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deckService: DeckService,
    private AuthService: AuthService,
    private title: Title
  ) {
  }

  ngOnInit() {
    this.authSub = this.AuthService.user.subscribe(_user => {
      this.user = _user;
      if (!this.user) {
        this.endUserSubs();
      }
      this.routeSub = this.route.data.subscribe(data => {
        if (data.showUserDecks) {
          this.displayPublic = false;
          if (!this.user) {
            this.router.navigate(['/user']);
          } else {
            this.deckSub = this.deckService.allDecksForUser(_user.uid).subscribe(_decks => {
              this.decks = _decks;
              this.title.setTitle('Vokabeldojo | Deine Decks');
            });
          }
        } else {
          this.publicDeckSub = this.deckService.allPublicDecks().subscribe(_decks => {
            this.decks = _decks;
          });
          this.title.setTitle('Vokabeldojo | Alle Decks');
        }
      });
    });
  }

  ngOnDestroy() {
    this.endUserSubs();
    if (this.routeSub) { this.routeSub.unsubscribe(); }
    if (this.authSub) { this.authSub.unsubscribe(); }
    if (this.publicDeckSub) { this.publicDeckSub.unsubscribe(); }
  }

  private endUserSubs() {
    if (this.deckSub) { this.deckSub.unsubscribe(); }
  }
}
