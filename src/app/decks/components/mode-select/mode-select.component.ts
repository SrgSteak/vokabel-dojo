import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FLY_IN_OUT_ANIMATION } from 'src/app/core/animations/modal.animation';
import { AuthService } from 'src/app/core/auth.service';
import { Card } from 'src/app/core/entities/card';
import { CardService } from 'src/app/core/services/card.service';
import { Learnmode } from 'src/app/learn/choose-mode/choose-mode.component';

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
  private uid: String;

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
    this.cardSub?.unsubscribe();
    this.authSub?.unsubscribe();
  }

  navigateToSelection(mode: Learnmode) {
    const uid = this.route.snapshot.paramMap.get('uid');
    switch (mode) {
      case Learnmode.learn:
        this.router.navigate(['/learn', { outlets: { primary: [uid, 'learn'], modal: null } }]);
        break;
      case Learnmode.quiz:
        this.router.navigate(['/learn', { outlets: { primary: [uid, 'quiz'], modal: null } }]);
        break;
      case Learnmode.spell:
        this.router.navigate(['/learn', { outlets: { primary: [uid, 'grid'], modal: null } }]);
        break;
    }
  }

  close() {
    this.router.navigate([]);
  }

}
