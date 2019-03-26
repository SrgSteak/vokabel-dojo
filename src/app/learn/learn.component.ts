import { Component, Input } from '@angular/core';
import { SyllablesService, flashcard } from '../syllables.service';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['learn.component.css']
})
export class LearnComponent  {
  hiragana: Array<flashcard>;
  show = 0;
  displayLeft='hiragana';
  displayRight='german';
  displayMode = 'always';
  clicked = false;
  showSubmenu = false;

  constructor(private syllablesService: SyllablesService) {
    this.hiragana = syllablesService.getAll();
  }

  setMode(mode: string) {
    this.displayMode = mode;
  }

  showNext() {
    if (this.displayMode === 'click' && this.clicked === false) {
      this.clicked = true;
    } else {
      this.show++;
      if (this.show >= this.hiragana.length) {
        this.show = 0;
      }
      if (this.displayMode == 'click') {
        this.clicked = false;
      }
    }
  }

}
