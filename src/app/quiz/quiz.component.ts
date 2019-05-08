import { Component, OnInit } from '@angular/core';
import { SyllablesService, flashcard } from '../syllables.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  showSubmenu = false;
  showCard: flashcard;
  answers: Array<flashcard>;
  questionMode: string;
  answerMode: string;
  numberAnswers = 3;
  displayError: boolean;
  misses: number;
  hits: number;

  hiragana: Array<flashcard>;
  formSub: Subscription;
  // settings
  filterForm = new FormGroup({
    row_a: new FormControl(''),
    row_k: new FormControl(''),
    row_s: new FormControl(''),
    row_t: new FormControl(''),
    row_na: new FormControl(''),
    row_h: new FormControl(''),
    row_m: new FormControl(''),
    row_y: new FormControl(''),
    row_r: new FormControl(''),
    row_w: new FormControl(''),
    row_n: new FormControl(''),
  });

  get scoredHiragana() {
    return this.hiragana.sort((a, b) => {
      if (a.hits - a.misses > b.hits - b.misses) {
        return -1
      }
      if (a.hits - a.misses < b.hits - b.misses) {
        return 1
      }
      return 0;
    });
  }

  constructor(public syllablesService: SyllablesService) {
    this.hiragana = syllablesService.getForRows(['a', 'k', 's', 't', 'na', 'h', 'm', 'y', 'r', 'w', 'n', 'dakuten_h', 'dakuten_k', 'dakuten_t', 'dakuten_s', 'handakuten_h']);
    this.questionMode = "hiragana";
    this.answerMode = "german";
    this.displayError = false;
    this.layout();
  }

  ngOnInit() {
    this.formSub = this.filterForm.valueChanges.subscribe(() => {
      this.setActiveRows();
    });
  }

  reset() {
    this.syllablesService.resetStatistic();
    this.displayError = false;
    this.layout();
  }

  setMode(question: string, answer: string) {
    this.questionMode = question;
    this.answerMode = answer;
  }

  layout() {
    do {
      this.syllablesService.shuffle(this.hiragana);
    } while (this.showCard == this.hiragana[0] && this.hiragana.length > 1);
    this.showCard = this.hiragana[0];
    this.answers = this.getAnswersFor(this.showCard);
  }

  continue() {
    this.displayError = false;
  }

  answerSelect(question: flashcard, answer: flashcard) {
    if (question.uid == answer.uid) {
      if (this.displayError == false) {
        this.syllablesService.totalHits++;
        question.hits++;
      }
      this.displayError = false;
      this.layout();
    } else {
      if (this.displayError == false) {
        question.misses++;
        this.syllablesService.totalMisses++;
        this.displayError = true;
      }
    }
  }

  getAnswersFor(card: flashcard) {
    // TODO: edit answers depending on question. Prefer handakuten in handakuten questions.

    let nAnswer = this.numberAnswers;
    if (this.hiragana.length < this.numberAnswers) {
      nAnswer = this.hiragana.length;
    }
    this.syllablesService.shuffle(this.hiragana);
    const draw = this.syllablesService.draw(
      this.hiragana.filter((value) => {
        if ([58, 59, 63, 64].includes(card.uid)) { // prevent double meaning syllables
          return value.uid !== card.uid && card.uid != 58 && card.uid != 59 && card.uid != 63 && card.uid != 64;
        } else {
          return value.uid !== card.uid
        }
      }),
      nAnswer
    );
    // console.log(draw);
    draw.push(card);
    return this.syllablesService.shuffle<flashcard>(draw);
  }

  updateNumberAnswers(number: number) {
    this.numberAnswers = number;
    this.layout();
  }

  setActiveRows() {
    const rows = [];
    if (this.filterForm.get('row_a').value) {
      rows.push('a');
    }
    if (this.filterForm.get('row_k').value) {
      rows.push('k');
    }
    if (this.filterForm.get('row_s').value) {
      rows.push('s');
    }
    if (this.filterForm.get('row_t').value) {
      rows.push('t');
    }
    if (this.filterForm.get('row_na').value) {
      rows.push('na');
    }
    if (this.filterForm.get('row_h').value) {
      rows.push('h');
    }
    if (this.filterForm.get('row_m').value) {
      rows.push('m');
    }
    if (this.filterForm.get('row_y').value) {
      rows.push('y');
    }
    if (this.filterForm.get('row_r').value) {
      rows.push('r');
    }
    if (this.filterForm.get('row_w').value) {
      rows.push('w');
    }
    if (this.filterForm.get('row_n').value) {
      rows.push('n');
    }

    if (rows.length > 0) {
      this.hiragana = this.syllablesService.getForRows(rows);
    } else {
      this.hiragana = this.syllablesService.getAll();
    }
    this.layout();
  }
}
