import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CardService } from 'src/app/core/services/card.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Deck } from 'src/app/core/services/deck.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/auth.service';
import { CardInterface } from 'src/app/core/entities/card-interface';

@Component({
  selector: 'app-new-card',
  templateUrl: './new-card.component.html',
  styleUrls: ['./new-card.component.css']
})
export class NewCardComponent implements OnInit {
  card: CardInterface;
  @Input() deck: Deck;
  @Input() user: User;
  @Output() newCard: EventEmitter<CardInterface> = new EventEmitter<CardInterface>();
  cardFormSub: Subscription;
  cardForm = this.fb.group({
    romaji: [''],
    hiragana: [''],
    katakana: [''],
    kanji: [''], // do not use me anymore
    german: [''],
    japanese: this.fb.array([]),
    reading: [''],
    japanese_readings: this.fb.array([]),
    chinese_readings: this.fb.array([]),
    examples: this.fb.array([]),
    decks: this.fb.array([])
  });

  get japanese_readings() {
    return this.cardForm.get('japanese_readings') as FormArray;
  }
  get chinese_readings() {
    return this.cardForm.get('chinese_readings') as FormArray;
  }
  get examples() {
    return this.cardForm.get('examples') as FormArray;
  }

  constructor(
    private cardService: CardService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.resetCard();
  }

  private resetCard() {
    this.card = { german: [], decks: [this.deck.uid] };
  }

  addReading(form: FormArray) {
    form.push(this.fb.control('', [Validators.required]));
  }

  addExample(form: FormArray) {
    const exampleGroup = this.fb.group({
      japanese: [''],
      reading: [''],
      german: ['']
    });
    this.examples.push(exampleGroup);
  }

  removeReadingAtIndex(form: FormArray, index) {
    form.removeAt(index);
  }

  removeReading(form: FormArray) {
    form.removeAt(form.length - 1);
  }

  onSubmit() {
    if (this.cardForm.valid) {
      this.card.german = this.cardForm.get('german').value;
      this.card.japanese = this.cardForm.get('japanese').value;
      this.card.chinese_readings = this.chinese_readings.value;
      this.card.japanese_readings = this.japanese_readings.value;
      this.cardService.add(this.card, this.deck, this.user);
      this.newCard.emit(this.card);
      this.resetCard();
      this.cardForm.get('german').setValue('');
      this.cardForm.get('romaji').setValue('');
      this.cardForm.get('hiragana').setValue('');
      this.cardForm.get('katakana').setValue('');
      this.cardForm.get('kanji').setValue('');
      this.cardForm.get('reading').setValue('');
      this.japanese_readings.setValue([]);
      this.chinese_readings.setValue([]);
      this.examples.setValue([]);
    }
  }
}
