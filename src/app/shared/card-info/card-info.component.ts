import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CardService } from 'src/app/core/services/card.service';
import { Card } from 'src/app/core/entities/card';
import { FLY_IN_OUT_ANIMATION } from 'src/app/core/animations/modal.animation';
import { CardType, WordType, AdjectiveType, VerbType } from 'src/app/core/entities/card-type';
import { SelectService } from 'src/app/core/services/select.service';
import { AuthService, User } from 'src/app/core/auth.service';

@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss'],
  animations: [
    FLY_IN_OUT_ANIMATION
  ]
})
export class CardInfoComponent implements OnInit, OnDestroy {

  @HostBinding('@flyInOutTrigger') flyInOutTrigger = 'in';
  user: User;
  card: Card;
  decks: Array<any> = [];
  authSub: Subscription;
  routerSub: Subscription;
  cardSub: Subscription;

  get cardTypes() {
    return CardType;
  }

  get wordTypes() {
    return WordType;
  }

  get adjectiveTypes() {
    return AdjectiveType;
  }

  get verbTypes() {
    return VerbType;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cardService: CardService,
    public selectService: SelectService) {
  }

  ngOnInit() {
    this.authSub = this.authService.user.subscribe(_user => {
      this.user = _user
      this.routerSub = this.route.paramMap.subscribe((params: ParamMap) => {
        this.cardSub = this.cardService.getCard(params.get('card')).subscribe(data => {
          this.card = data;
        });
      });
    });
  }

  ngOnDestroy() {
    if (this.routerSub) { this.routerSub.unsubscribe(); }
    if (this.cardSub) { this.cardSub.unsubscribe(); }
    if (this.authSub) { this.authSub.unsubscribe(); }
  }

  close() {
    this.router.navigate([{ outlets: { modal: null } }]);
  }

  select() {
    if (this.selectService.contains(this.card)) {
      this.selectService.removeCard(this.card);
    } else {
      this.selectService.addCard(this.card);
    }
  }
}
