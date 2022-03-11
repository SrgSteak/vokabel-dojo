import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FLY_IN_OUT_ANIMATION } from 'src/app/core/animations/modal.animation';
import { AuthService } from 'src/app/core/auth.service';
import { Card } from 'src/app/core/entities/card';
import { CardService } from 'src/app/core/services/card.service';
import { Learnmode } from 'src/app/shared/shared-learnmode/choose-mode/choose-mode.component';

@Component({
  selector: 'app-mode-select',
  templateUrl: './mode-select.component.html',
  styleUrls: ['./mode-select.component.scss'],
  animations: [
    FLY_IN_OUT_ANIMATION
  ]
})
export class ModeSelectComponent implements OnInit, OnDestroy {

  @HostBinding('@flyInOutTrigger') flyInOutTrigger = 'in';
  cards: Card[] = [];
  loading = true;

  private cardSub: Subscription;
  private authSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cardService: CardService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.cardSub = this.cardService.loadForDeckUid(this.route.snapshot.paramMap.get('uid'), user ? ['', user.uid] : ['']).subscribe(cards => {
        this.loading = false;
        this.cards = cards;
      });
    })
  }

  ngOnDestroy(): void {
    if (this.cardSub) { this.cardSub.unsubscribe(); }
    if (this.authSub) { this.authSub.unsubscribe(); }
  }

  navigateToSelection(mode: Learnmode) {
    switch (mode) {
      case Learnmode.learn:
        this.router.navigate(['/decks', { outlets: { primary: [this.route.snapshot.paramMap.get('uid'), 'learn'], modal: null } }]);
        break;
      case Learnmode.quiz:
        this.router.navigate(['/decks', { outlets: { primary: [this.route.snapshot.paramMap.get('uid'), 'quiz'], modal: null } }]);
        break;
      case Learnmode.spell:
        this.router.navigate(['/decks', { outlets: { primary: [this.route.snapshot.paramMap.get('uid'), 'grid'], modal: null } }]);
        break;
    }
  }

  close() {
    this.router.navigate([]);
  }

}
