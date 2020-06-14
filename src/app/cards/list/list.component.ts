import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardService } from 'src/app/core/services/card.service';
import { Card } from 'src/app/core/entities/card';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  cards = [];
  private cardSub: Subscription;

  constructor(private cardService: CardService) {
  }

  ngOnInit() {
    this.cardSub = this.cardService.allPublicCards().subscribe(data => {
      this.cards = data.map(e => {
        const card = Card.createFromCardInterface(e);
        return card;
      })
    })
  }

  ngOnDestroy() {
    if (this.cardSub) { this.cardSub.unsubscribe(); }
  }

}
