import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, User } from '../core/auth.service';
import { DeckService } from '../core/services/deck.service';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { DeckInterface } from '../core/entities/deck';
import { APPEAR_ANIMATION } from '../core/animations/modal.animation';
import { MenuService } from '../shared/menu/menu.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  animations: [APPEAR_ANIMATION]
})
export class WelcomeComponent implements OnInit, OnDestroy {

  user: User = null;
  userDecks = [];
  publicDecks: DeckInterface[] = [];

  userDeckSub: Subscription;
  publicDeckSub: Subscription;
  authSub: Subscription;

  constructor(public auth: AuthService, private deckService: DeckService, private title: Title, protected menuService: MenuService) { }

  ngOnInit() {
    this.title.setTitle('Vokabeldojo | Home');
    this.authSub = this.auth.user.subscribe(user => {
      this.user = user;
      this.publicDeckSub = this.deckService.findNewestPublicDecks().subscribe(res => {
        this.publicDecks = res;
      });
      if (user && user.uid) {
        this.userDeckSub = this.deckService.findNewestDecksForUser(user.uid).subscribe(res => {
          this.userDecks = res;
        });
      } else {
        this.userDecks = [];
        if (this.userDeckSub) { this.userDeckSub.unsubscribe(); }
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) { this.authSub.unsubscribe(); }
    if (this.userDeckSub) { this.userDeckSub.unsubscribe(); }
    if (this.publicDeckSub) { this.publicDeckSub.unsubscribe(); }
  }

}
