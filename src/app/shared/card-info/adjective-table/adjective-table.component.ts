import { Component, OnInit, Input } from '@angular/core';
import { Card } from 'src/app/core/entities/card';
import { AdjectiveType } from 'src/app/core/entities/card-type';

export enum konjugationType {
  default = 0,
  negated = 1
}

@Component({
  selector: 'app-adjective-table',
  templateUrl: './adjective-table.component.html',
  styleUrls: ['./adjective-table.component.css']
})
export class AdjectiveTableComponent implements OnInit {

  @Input() card: Card;

  get konjugationTypes() {
    return konjugationType;
  }

  constructor() { }

  ngOnInit() {
  }

  flexLemma(card: Card, destination: konjugationType): string {
    switch (card.adjectiveType) {
      case AdjectiveType.iAdjective:
        switch (destination) {
          case konjugationType.default:
            return card.japanese;
          case konjugationType.negated:
            return card.japanese.substring(0, card.japanese.length - 1) + 'くない';
        }

      case AdjectiveType.naAdjective:
        switch (destination) {
          case konjugationType.default:
            return card.japanese;
          case konjugationType.negated:
            return card.japanese + 'ではありません';
        }
    }
  }

}
