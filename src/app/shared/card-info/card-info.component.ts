import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { Subscription } from 'rxjs';
import { CardService } from 'src/app/core/services/card.service';
import { Card } from 'src/app/core/entities/card';
import { FLY_IN_OUT_ANIMATION } from 'src/app/core/animations/modal.animation';
import { DeckService, Deck } from 'src/app/core/services/deck.service';
import { CardType, WordType } from 'src/app/core/entities/card-type';

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
  card: CardInterface;
  decks: Array<any> = [];
  routerSub: Subscription;

  get cardTypes() {
    return CardType;
  }

  get wordTypes() {
    return WordType;
  }

  constructor(private router: Router, private route: ActivatedRoute, private cardService: CardService, private deckService: DeckService) {
  }

  ngOnInit() {
    this.routerSub = this.route.paramMap.subscribe((params: ParamMap) => {
      this.cardService.get(params.get('card')).snapshotChanges().subscribe(data => {
        this.card = Card.createFromCardInterface(data.payload.data());
        this.card.uid = data.payload.id;
      });
    });
  }

  ngOnDestroy() {
    if (this.routerSub) { this.routerSub.unsubscribe(); }
  }

  close() {
    this.router.navigate([{ outlets: { modal: null } }]);
  }
}
