import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CardService } from 'src/app/core/services/card.service';
import { Card } from 'src/app/core/entities/card';
import { FLY_IN_OUT_ANIMATION } from 'src/app/core/animations/modal.animation';
import { CardType, WordType, AdjectiveType, VerbType } from 'src/app/core/entities/card-type';
import { SelectService } from 'src/app/core/services/select.service';
import { AuthService, User } from 'src/app/core/auth.service';
import { FontSwitcherService } from 'src/app/core/services/font-switcher.service';
import { FeatherModule } from 'angular-feather';
import { CommonModule } from '@angular/common';
import { KanjiModule } from '../kanji/kanji.module';
import { WordTypeComponent } from '../word-type/word-type.component';
import { IconsModule } from './icons.module';
import { DecknamePipe } from 'src/app/pipes/deckname.pipe';
import { VerbTableComponent } from './verb-table/verb-table.component';
import { AdjectiveTableComponent } from './adjective-table/adjective-table.component';

@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IconsModule, KanjiModule, WordTypeComponent, VerbTableComponent, AdjectiveTableComponent, DecknamePipe],
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
    public selectService: SelectService,
    protected fontService: FontSwitcherService) {
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
    this.routerSub?.unsubscribe();
    this.cardSub?.unsubscribe();
    this.authSub?.unsubscribe();
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
