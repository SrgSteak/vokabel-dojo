import { Component, OnInit, OnDestroy, HostBinding, HostListener } from '@angular/core';
import { AuthService, User } from '../core/auth.service';
import { DeckService } from '../core/services/deck.service';
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
  holiday: string;

  userDeckSub: Subscription;
  publicDeckSub: Subscription;
  authSub: Subscription;

  constructor(public auth: AuthService, private deckService: DeckService, protected menuService: MenuService) { }

  ngOnInit() {
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
        this.userDeckSub?.unsubscribe();
      }
    });
    this.holiday = this.getHoliday();
  }

  private getHoliday() {
    const now = new Date();

    // feb 14
    if (now.getMonth() === 1 && now.getDate() === 14) {
      return 'valentin'
    }
    // STOOTSFEIERTOG may 01
    if (now.getMonth() === 4 && now.getDate() === 1) {
      return 'staatsfeiertag'
    }
    // pirate day sept 19
    if (now.getMonth() === 8 && now.getDate() === 19) {
      return 'pirateDay'
    }
    // spooptober oct 15
    if (now.getMonth() === 9 && now.getDate() > 14) {
      return 'spooktober'
    }
    // dec 23 - 25
    if (now.getMonth() === 11 && now.getDate() > 22 && now.getDate() < 26) {
      return 'xmas';
    }
    // dec 31 - jan 1
    if (now.getMonth() === 11 && now.getDate() > 30 || now.getMonth() === 0 && now.getDate() < 2) {
      return 'newYear';
    }

  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.userDeckSub?.unsubscribe();
    this.publicDeckSub?.unsubscribe();
  }

  // @HostListener('focus') noFocus() {
  //   this.holiday = this.getHoliday();
  // }

}
