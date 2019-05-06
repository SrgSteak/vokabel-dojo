import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CardService, Card } from 'src/app/core/services/card.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Deck } from 'src/app/core/services/deck.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/auth.service';

@Component({
  selector: 'app-new-card',
  templateUrl: './new-card.component.html',
  styleUrls: ['./new-card.component.css']
})
export class NewCardComponent implements OnInit {
  card: Card;
  @Input() deck: Deck;
  @Input() user: User;
  @Output() newCard: EventEmitter<Card> = new EventEmitter<Card>();
  cardFormSub: Subscription;
  cardForm = this.fb.group({
    german: ['', [Validators.required]],
    romaji: [''],
    hiragana: [''],
    katakana: [''],
    kanji: [''],
    decks: this.fb.array([])
  });

  constructor(
    private cardService: CardService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.resetCard();
  }

  private resetCard() {
    this.card = { german: '', decks: [this.deck.uid], hits: 0, misses: 0 };
  }

  onSubmit() {
    if (this.cardForm.valid) {
      this.card.german = this.cardForm.get('german').value;
      this.card.romaji = this.cardForm.get('romaji').value;
      this.card.hiragana = this.cardForm.get('hiragana').value;
      this.card.katakana = this.cardForm.get('katakana').value;
      this.card.kanji = this.cardForm.get('kanji').value;
      this.cardService.add(this.card, this.deck, this.user);
      this.newCard.emit(this.card);
      this.resetCard();
      this.cardForm.get('german').setValue('');
      this.cardForm.get('romaji').setValue('');
      this.cardForm.get('hiragana').setValue('');
      this.cardForm.get('katakana').setValue('');
      this.cardForm.get('kanji').setValue('');
    }
  }
}
