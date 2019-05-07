import { Component, OnInit, Input } from '@angular/core';
import { VocabularyService } from '../../vocabulary.service';
import { wordFlashcard } from '../../interfaces/word-flashcard.interface';
import { flashcard } from '../../interfaces/flashcard.interface';
import { ActivatedRoute } from '@angular/router';
import { DeckService } from 'src/app/core/services/deck.service';
import { Card } from 'src/app/core/services/card.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-word-quiz',
  templateUrl: './word-quiz.component.html',
  styleUrls: ['./word-quiz.component.scss']
})
export class WordQuizComponent implements OnInit {

  @Input() deck: Array<Card>;
  showCard: Card;
  answers: Array<Card>;
  displayError = false;
  displayStatistic = false;
  showSubmenu = false;
  numberAnswers = 3;
  modeSub: Subscription;
  modeForm = new FormGroup({
    left: new FormControl('kanji'),
    right: new FormControl('german'),
    rubi: new FormControl('')
  });
  enableHiragana = false;
  enableKatakana = false;
  enableKanji = false;
  peekRubi = false;

  get questionMode() {
    return this.modeForm.get('left').value;
  }

  get answerMode() {
    return this.modeForm.get('right').value;
  }

  get rubi() {
    return this.modeForm.get('rubi').value;
  }


  constructor(private route: ActivatedRoute, public deckService: DeckService) {
  }

  get scoredWords() {
    return this.deck.sort((a, b) => {
      if (a.hits - a.misses > b.hits - b.misses) {
        return -1
      }
      if (a.hits - a.misses < b.hits - b.misses) {
        return 1
      }
      return 0;
    });
  }

  ngOnInit() {
    this.updateAvailableModes();
    this.layout();
  }

  toggleStatistic() {
    this.displayStatistic = !this.displayStatistic;
  }

  reset() {
    this.displayError = false;
    this.layout();
  }

  layout() {
    this.showCard = this.deck[0];
    do {
      this.deckService.shuffle(this.deck);
    } while (this.showCard.uid == this.deckService.draw(this.deck, 1)[0].uid && this.deck.length > 1);
    this.showCard = this.deckService.draw(this.deck, 1)[0];
    this.answers = this.deckService.draw(
      this.deck.filter((value) => { return value.uid !== this.showCard.uid }),
      this.numberAnswers
    );
    this.answers.push(this.showCard);
    this.answers = this.deckService.shuffle(this.answers);
  }

  answerSelect(question: Card, answer: Card) {
    if (question.uid == answer.uid) {
      this.deckService.totalHits++;
      if (!this.displayError) {
        question.hits++;
      }
      this.displayError = false;
      this.layout();
    } else {
      console.log('not correct');
      if (!this.displayError) {
        question.misses++;
        this.deckService.totalMisses++;
        this.displayError = true;
      }
    }
  }

  updateNumberAnswers(number: number) {
    this.numberAnswers = number;
    this.layout();
  }

  reading(word: Card, mode: string) {
    if (word.hasOwnProperty(mode)) {
      if (word[mode]) {
        return word[mode];
      }
    }
    if (word['kanji']) {
      return word['kanji'];
    }
    if (word['hiragana']) {
      return word['hiragana'];
    }
    if (word['katakana']) {
      return word['katakana'];
    }
    if (word['romaji']) {
      return word['romaji'];
    }
  }

  updateAvailableModes() {
    this.enableHiragana = false;
    this.enableKatakana = false;
    this.enableKanji = false;
    this.deck.forEach(card => {
      if (card.hiragana) {
        this.enableHiragana = true;
      }
      if (card.katakana) {
        this.enableKatakana = true;
      }
      if (card.kanji) {
        this.enableKanji = true;
      }
    })
  }
}

