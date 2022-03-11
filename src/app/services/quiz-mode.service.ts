import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class QuizModeService {

  modeForm = new FormGroup({
    left: new FormControl('japanese'), // select what is displayed on top
    right: new FormControl('german'), // select what is displayed on bottom
    rubi: new FormControl(''), // select if ruby should be displayed as well
    difficulty: new FormControl('1') // the difficulty, 1 = easy, 2 = moderate, 3 = hard
  });

  constructor() { }

  reset() {
    this.modeForm.get('left').setValue('japanese');
    this.modeForm.get('right').setValue('german');
    this.modeForm.get('ruby').setValue(false);
    this.modeForm.get('difficulty').setValue(1);
  }

  get questionMode() {
    return this.modeForm.get('left').value;
  }

  get answerMode() {
    return this.modeForm.get('right').value;
  }

  get rubi() {
    return this.modeForm.get('rubi').value;
  }
}
