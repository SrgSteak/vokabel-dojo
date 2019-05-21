import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Deck, DeckService } from 'src/app/core/services/deck.service';
import { AuthService } from 'src/app/core/auth.service';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { CardService } from 'src/app/core/services/card.service';

@Component({
  selector: 'app-user-card-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditCardComponent implements OnInit {

  user_uid: string;
  deck_uid: string;
  card: CardInterface;
  decks: Array<Deck>;
  cardForm = this.fb.group({
    german: this.fb.array([]),
    japanese: [''],
    japanese_readings: this.fb.array([]),
    chinese_readings: this.fb.array([]),
    examples: this.fb.array([])
  });

  get deckForm() {
    return this.cardForm.get('decks') as FormArray;
  }

  get german() {
    return this.cardForm.get('german') as FormArray;
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
    private cardService: CardService,
    private deckService: DeckService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user_uid = user.uid;
      this.route.paramMap.subscribe(params => {
        this.deck_uid = params.get('deck_uid');
        if (params.has('card_uid')) {
          this.cardService.get(params.get('card_uid'), params.get('deck_uid'), user.uid).snapshotChanges().subscribe(data => {
            this.card = data.payload.data();
            this.card.uid = data.payload.id;
            // prefill form;
            this.card.german.forEach(german => {
              this.addReading(this.german, german);
            });
            this.card.japanese_readings.forEach(reading => {
              this.addReading(this.japanese_readings, reading);
            });
            this.card.chinese_readings.forEach(reading => {
              this.addReading(this.chinese_readings, reading);
            });
            this.card.examples.forEach(example => {
              this.addExample(this.examples, example);
            })
          })
        } else {
          this.card = { german: [], decks: [] };
        }
      })
    });
  }

  addExample(form: FormArray, example?: { japanese?: string, reading?: string, german?: string }) {
    if (example) {
      const exampleGroup = this.fb.group({
        japanese: example.japanese,
        reading: example.reading,
        german: example.german
      });
      form.push(exampleGroup);
    } else {
      const exampleGroup = this.fb.group({
        japanese: [''],
        reading: [''],
        german: ['']
      });
      form.push(exampleGroup);
    }
  }

  addReading(form: FormArray, content = '') {
    form.push(this.fb.control(content, [Validators.required]));
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
      this.card.japanese_readings = this.japanese_readings.value;
      this.card.chinese_readings = this.chinese_readings.value;
      this.card.examples = this.examples.value;

      if (this.card.uid) {
        this.cardService.update(this.card, this.deck_uid, this.user_uid);
      } else {
        this.cardService.add(this.card);
      }
      this.router.navigate(['/', 'user', 'decks', this.deck_uid, 'list']);
    }
  }

  onDelete() {
    if (confirm('Karte löschen? Sie wird aus allen Decks entfernt in denen sie enthalten war.')) {
      this.cardService.delete(this.card.uid);
      this.router.navigate(['/', 'user', 'decks', this.deck_uid, 'list']);
    }
  }
}
