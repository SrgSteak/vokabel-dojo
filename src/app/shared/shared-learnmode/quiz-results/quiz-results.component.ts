import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ROLL_IN_OUT_ANIMATION } from 'src/app/core/animations/modal.animation';
import { Card } from 'src/app/core/entities/card';
import { SelectService } from 'src/app/core/services/select.service';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss'],
  animations: [ROLL_IN_OUT_ANIMATION]
})
export class QuizResultsComponent implements OnInit {

  @Output() public end = new EventEmitter();
  @Output() public again = new EventEmitter();

  @Input() public scores: Card[] = [];

  constructor(private selectService: SelectService) { }

  showMisses = false;
  showHits = false;

  ngOnInit(): void {
  }

  get hits() {
    return this.scores.filter(card => card.hits > card.misses);
  }

  get misses() {
    return this.scores.filter(card => card.misses >= card.hits);
  }

  get score() {
    return Math.round(this.hits.length / this.scores.length * 100);
  }

  get hasScore() {
    return !Number.isNaN(this.score);
  }

  addMissesToSelection() {
    this.misses.forEach(card => {
      this.selectService.addCard(card);
    });
  }

}
