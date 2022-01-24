import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { DeckService } from '../core/services/deck.service';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { DeckInterface } from '../core/entities/deck';
import { COLLAPSE_ANIMATION } from '../core/animations/modal.animation';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  animations: [COLLAPSE_ANIMATION]
})
export class WelcomeComponent implements OnInit, OnDestroy {

  userDecks = [];
  userDeckSub: Subscription;

  publicDecks: DeckInterface[] = [];
  publicDeckSub: Subscription;

  constructor(public auth: AuthService, private deckService: DeckService, private title: Title) { }

  ngOnInit() {
    this.title.setTitle('Vokabeldojo | Home');
    this.auth.user.subscribe(user => {
      this.publicDeckSub = this.deckService.findNewestPublicDecks().subscribe(res => {
        this.publicDecks = res;
      });
      if (user) {
        this.userDeckSub = this.deckService.findNewestDecksForUser(user.uid).subscribe(res => {
          this.userDecks = res;
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.userDeckSub) { this.userDeckSub.unsubscribe(); }
    if (this.publicDeckSub) { this.publicDeckSub.unsubscribe(); }
  }

}
