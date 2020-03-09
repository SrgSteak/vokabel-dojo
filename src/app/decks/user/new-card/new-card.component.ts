import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CardService } from 'src/app/core/services/card.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Deck } from 'src/app/core/services/deck.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/auth.service';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { Card } from 'src/app/core/entities/card';

@Component({
  selector: 'app-new-card',
  templateUrl: './new-card.component.html',
  styleUrls: ['./new-card.component.css']
})
export class NewCardComponent implements OnInit {
  card: CardInterface;
  @Input() deck: Deck;
  @Output() newCard: EventEmitter<CardInterface> = new EventEmitter<CardInterface>();
  cardFormSub: Subscription;
  cardForm = this.fb.group({
    japanese: ['', Validators.required],
    japanese_readings: this.fb.array([]),
    chinese_readings: this.fb.array([]),
    german: this.fb.array([]),
    decks: this.fb.array([]),
    examples: this.fb.array([])
  });

  get german() {
    return this.cardForm.get('german') as FormArray;
  }

  get japanese() {
    return this.cardForm.get('japanese') as FormArray;
  }

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
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.resetCard();
    this.setForm();
  }

  private resetCard() {
    this.card = new Card();
    if (this.deck) {
      // this.card.decks.push(this.deck.uid);
    }
  }

  addReading(form: FormArray) {
    form.push(this.fb.control('', [Validators.required]));
  }

  addExample(form: FormArray) {
    const exampleGroup = this.fb.group({
      japanese: ['', Validators.required],
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

  setForm() {
    this.cardForm = this.fb.group({
      japanese: ['', Validators.required],
      japanese_readings: this.fb.array([]),
      chinese_readings: this.fb.array([]),
      german: this.fb.array([]),
      decks: this.fb.array([]),
      examples: this.fb.array([])
    });
  }

  onSubmit() {
    if (this.cardForm.valid) {
      this.card.german = this.cardForm.get('german').value;
      this.card.japanese = this.cardForm.get('japanese').value;
      this.card.chinese_readings = this.chinese_readings.value;
      this.card.japanese_readings = this.japanese_readings.value;
      this.card.examples = this.examples.value;
      // this.cardService.add(this.card, this.deck, this.user);
      this.newCard.emit(this.card);
      this.resetCard();
      this.setForm();
    }
  }
}
