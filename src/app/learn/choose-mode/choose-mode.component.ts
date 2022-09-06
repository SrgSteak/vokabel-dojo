import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LEARNMODE_ANIMATION } from 'src/app/core/animations/modal.animation';
import { Card } from 'src/app/core/entities/card';
import { WordType } from 'src/app/core/entities/card-type';

export enum Learnmode {
  learn,
  quiz,
  spell
}

@Component({
  selector: 'app-choose-mode',
  templateUrl: './choose-mode.component.html',
  styleUrls: ['./choose-mode.component.scss'],
  animations: [
    LEARNMODE_ANIMATION
  ]
})
export class ChooseModeComponent implements OnInit {

  @Input() private cards: Card[] = [];
  @Output() public selectedMode = new EventEmitter<Learnmode>();


  get learnmode() {
    return Learnmode;
  }

  constructor() { }

  ngOnInit(): void {}

  public supportsLearnMode() {
    return this.cards.length > 4;
  }

  public supportsQuizMode() {
    return this.cards.length > 4;
  }

  public supportsSpellMode() {
    return this.cards.length > 4;
  }

  public supportsSentencebuilderMode() {
    return this.cards.filter(card => card.wordType == WordType.sentence).length > 4;
  }

  public sMode(mode: Learnmode, emit: boolean) {
    if (emit) {
      this.selectedMode.emit(mode);
    }
  }
}
