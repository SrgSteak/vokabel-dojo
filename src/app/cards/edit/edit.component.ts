import { Component, OnInit } from '@angular/core';
import { CardService } from 'src/app/core/services/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Deck, DeckService } from 'src/app/core/services/deck.service';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { Card } from 'src/app/core/entities/card';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  card: CardInterface;
  decks: Array<Deck>;
  cardForm = this.fb.group({
    german: this.fb.array([]),
    japanese: [''],
    japanese_readings: this.fb.array([]),
    chinese_readings: this.fb.array([]),
    decks: this.fb.array([]),
    examples: this.fb.array([])
  });

  get german() {
    return this.cardForm.get('german') as FormArray;
  }
  get japanese() {
    return this.cardForm.get('japanese') as FormControl;
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

  get deckForm() {
    return this.cardForm.get('decks') as FormArray;
  }

  constructor(
    private cardService: CardService,
    private deckService: DeckService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('uid')) {
        this.cardService.get(params.get('uid')).snapshotChanges().subscribe(data => {
          this.card = Card.createFromCardInterface(data.payload.data());
          this.card.uid = data.payload.id;
          // prefill form;
          this.cardForm.get('japanese').setValue(this.card.japanese);

          this.card.german.forEach(german => {
            this.addReading(this.german, german);
          })

          this.card.japanese_readings.forEach(reading => {
            this.addReading(this.japanese_readings, reading);
          });
          this.card.chinese_readings.forEach(reading => {
            this.addReading(this.chinese_readings, reading);
          });
          if (this.card.examples) {

            this.card.examples.forEach(example => {
              this.addExample(this.examples, example);
            })
          }
        })
        this.prepareDecks();
      } else {
        this.card = { german: [], decks: [] };
        this.prepareDecks();
      }
    })

  }

  private prepareDecks() {
    this.deckService.loadAll().snapshotChanges().subscribe(data => {
      this.decks = data.map(e => {
        const deck = e.payload.doc.data() as Deck;
        deck.uid = e.payload.doc.id;
        return deck;
      });
      this.decks.forEach(deck => {
        const control = this.fb.control('');
        if (this.card.decks && this.card.decks.includes(deck.uid)) {
          control.setValue(true);
        }
        this.deckForm.push(control);
      });
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
      this.card.german = this.german.value;
      this.card.japanese = this.japanese.value;
      this.card.chinese_readings = this.chinese_readings.value;
      this.card.japanese_readings = this.japanese_readings.value;
      this.card.examples = this.examples.value;
      let i = 0;
      this.card.decks = [];
      this.decks.forEach(deck => {
        if (this.deckForm.controls[i].value) {
          this.card.decks.push(deck.uid)
        }
        i++;
      });
      if (this.card.uid) {
        this.cardService.update(this.card);
      } else {
        this.cardService.add(this.card);
      }
      this.router.navigate(['/cards']);
    }
  }

  onDelete() {
    if (confirm('Karte löschen? Sie wird aus allen Decks entfernt in denen sie enthalten war.')) {
      this.cardService.delete(this.card.uid);
      this.router.navigate(['/cards']);
    }
  }
}
