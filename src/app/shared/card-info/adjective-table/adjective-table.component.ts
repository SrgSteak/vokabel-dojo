import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { AdjectiveType } from 'src/app/core/entities/card-type';

export enum konjugationType {
  default = 0,
  negated = 1,
  past = 2,
  negatedPast = 3
}

@Component({
  selector: 'app-adjective-table',
  templateUrl: './adjective-table.component.html',
  styleUrls: ['./adjective-table.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AdjectiveTableComponent implements OnInit {

  @Input() card: CardInterface;

  get konjugationTypes() {
    return konjugationType;
  }

  constructor() { }

  ngOnInit() {
  }

  flexLemma(card: CardInterface, destination: konjugationType): string {
    switch (card.adjectiveType) {
      // い形容詞
      case AdjectiveType.iAdjective:
        switch (destination) {
          case konjugationType.default:
            return card.japanese;
          case konjugationType.past:
            return card.japanese.substring(0, card.japanese.length - 1) + 'かった';
          case konjugationType.negated:
            return card.japanese.substring(0, card.japanese.length - 1) + 'くない';
          case konjugationType.negatedPast:
            return card.japanese.substring(0, card.japanese.length - 1) + 'くなかった';
        }

      // な形容詞
      case AdjectiveType.naAdjective:
        switch (destination) {
          case konjugationType.default:
            return card.japanese;
          case konjugationType.past:
            return card.japanese + 'でした'
          case konjugationType.negated:
            return card.japanese + 'ではありません';
          case konjugationType.negatedPast:
            return card.japanese + 'ではありませんでした';
        }
    }
  }

}
