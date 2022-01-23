import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { DeckService } from '../core/services/deck.service';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {

  decks = [];
  deckSub: Subscription;

  constructor(public auth: AuthService, private deckService: DeckService, private title: Title) { }

  ngOnInit() {
    this.title.setTitle('Vokabeldojo | Home');
    this.auth.user.subscribe(user => {
      if (user) {
        this.deckSub = this.deckService.allDecksForUser(user.uid).subscribe(res => {
          this.decks = res;
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.deckSub) { this.deckSub.unsubscribe(); }
  }

}
