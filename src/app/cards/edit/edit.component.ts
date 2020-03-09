import { Component, OnInit, Output, EventEmitter, HostBinding, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CardService } from 'src/app/core/services/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Deck, DeckService } from 'src/app/core/services/deck.service';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { Card } from 'src/app/core/entities/card';
import { CardType, WordType, VerbType, AdjectiveType } from 'src/app/core/entities/card-type';
import { FLY_IN_OUT_ANIMATION, ROLL_IN_OUT_ANIMATION } from 'src/app/core/animations/modal.animation';
import { Subscription, Observable, Subject, of } from 'rxjs';
import { switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  animations: [
    FLY_IN_OUT_ANIMATION,
    ROLL_IN_OUT_ANIMATION
  ]
})
export class EditComponent implements OnInit {

  @HostBinding('@flyInOutTrigger') flyInOutTrigger = 'in';
  @ViewChild('editWindow', { static: true }) editWindow: ElementRef;
  @ViewChild('searchWindow', { static: false }) searchWindow: ElementRef;
  @Output() updateCard = new EventEmitter<CardInterface>();
  @Output() deleteCard = new EventEmitter();

  card: CardInterface;
  decks: Array<Deck>;
  createMode = false;
  showWordTypes = CardType.simple;
  cardForm = this.prepareCardForm();

  phrase$ = new Subject<string>();
  suggestions: Observable<Array<Deck>> = this.phrase$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((phrase: string) => {
      return this.deckService.findByName(phrase);
    }
    ));

  cardTypeToggle = false;
  wordTypeToggle = false;
  verbTypeToggle = false;
  adjectiveTypeToggle = false;
  toggleSearch = false;

  private wordSub: Subscription;
  private verbSub: Subscription;
  private adjectiveSub: Subscription;

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
  get cardType() {
    return this.cardForm.get('cardType') as FormControl;
  }
  get wordType() {
    return this.cardForm.get('wordType') as FormControl;
  }
  get verbType() {
    return this.cardForm.get('verbType') as FormControl;
  }
  get adjectiveType() {
    return this.cardForm.get('adjectiveType') as FormControl;
  }

  get cardTypes() {
    return CardType;
  }

  get wordTypes() {
    return WordType;
  }

  get verbTypes() {
    return VerbType;
  }
  get adjectiveTypes() {
    return AdjectiveType;
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
      if (params.has('uid')) { // edit card
        this.cardService.get(params.get('uid')).snapshotChanges().subscribe(data => {
          this.card = Card.createFromCardInterface(data.payload.data());
          this.card.uid = data.payload.id;
          // prefill form;
          this.cardForm.get('japanese').setValue(this.card.japanese);
          this.cardForm.get('cardType').setValue(this.card.cardType ? '1' : '0');

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
          this.prepareDecks();
        })
      } else { // create card
        this.createMode = true;
        this.card = { german: [], decks: [], cardType: CardType.simple };
        // this.prepareDecks();
      }
    })
    this.cardType.valueChanges.subscribe((value: CardType) => {
      this.cardTypeToggle = false;
      if (value == CardType.simple) {
        this.removeField('wordType');
        this.wordTypeToggle = false;
        if (this.wordSub) {
          this.wordSub.unsubscribe();
        }
        this.removeField('verbType');
        this.removeField('adjectiveType');
      } else {
        this.addField('wordType');
        this.wordTypeToggle = true;
        this.wordSub = this.wordType.valueChanges.subscribe((value: WordType) => {
          switch (value) {
            case WordType.verb: // remove all wordtypes except verbType
              this.removeField('adjectiveType');
              this.addField('verbType', this.card.verbType ? this.card.verbType : null);
              this.verbTypeToggle = true;
              this.verbSub = this.verbType.valueChanges.subscribe((value: VerbType) => {
                this.verbTypeToggle = false;
              });
              break;

            case WordType.adjective: // remove all wordtypes except adjectiveType
              if (this.verbSub) {
                this.verbSub.unsubscribe();
              }
              this.removeField('verbType');
              this.addField('adjectiveType', this.card.adjectiveType ? this.card.adjectiveType : null);
              this.adjectiveTypeToggle = true;
              this.adjectiveSub = this.adjectiveType.valueChanges.subscribe((value: AdjectiveType) => {
                this.adjectiveTypeToggle = false;
              });
              break;
            default: // remove all fields
              this.removeField('adjectiveType');
              this.removeField('verbType');
              if (this.verbSub) {
                this.verbSub.unsubscribe();
              }

              break;
          }
          this.wordTypeToggle = false;
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.verbSub) {
      this.verbSub.unsubscribe();
    }
    if (this.adjectiveSub) {
      this.adjectiveSub.unsubscribe();
    }
  }

  updatedPhrase(phrase: string) {
    if (phrase != '') {
      this.phrase$.next(phrase);
    } else {
      this.toggleSearch = false;
    }
  }

  addDeckToCard(deck: Deck) {
    if (!this.deckForm.value.find(form => form.uid == deck.uid)) {
      console.log(deck);
      const uidForm = new FormControl('', Validators.required);
      uidForm.setValue(deck.uid);
      const nameForm = new FormControl('');
      nameForm.setValue(deck.name);
      const deckGroup = this.fb.group({
        uid: uidForm,
        name: nameForm
      });
      this.deckForm.push(deckGroup);
    }
  }

  removeDeckFromCard(index: number) {
    this.deckForm.removeAt(index);
  }

  prepareCardForm() {
    return this.fb.group({
      cardType: ['0', Validators.required],
      german: this.fb.array([]),
      japanese: ['', Validators.required],
      japanese_readings: this.fb.array([]),
      chinese_readings: this.fb.array([]),
      decks: this.fb.array([]),
      examples: this.fb.array([])
    });
  }

  addField(field: string, value: any = null, validators: Array<Validators> = [Validators.required]) {
    this.cardForm.addControl(field, new FormControl('', ...validators));
    if (value) {
      this.cardForm.get(field).setValue(value);
    } else if (this.card[field]) {
      this.cardForm.get(field).setValue(this.card[field]);
    }
  }

  removeField(field: string) {
    this.cardForm.removeControl(field);
  }

  private prepareDecks() {
    if (this.card.decks && this.card.decks.length) {
      this.card.decks.forEach(_deck => {
        const uidForm = new FormControl('', Validators.required);
        uidForm.setValue(_deck.uid);
        const nameForm = new FormControl('');
        nameForm.setValue(_deck.name);
        const deckGroup = this.fb.group({
          uid: uidForm,
          name: nameForm
        });
        this.deckForm.push(deckGroup);
      })
    }
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
        japanese: ['', Validators.required],
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
      this.card.cardType = this.cardType.value;
      if (this.wordType) {
        this.card.wordType = this.wordType.value;
      }
      if (this.verbType) {
        this.card.verbType = this.verbType.value;
      }
      if (this.adjectiveType) {
        this.card.adjectiveType = this.adjectiveType.value;
      }
      this.card.german = this.german.value;
      this.card.japanese = this.japanese.value;
      this.card.chinese_readings = this.chinese_readings.value;
      this.card.japanese_readings = this.japanese_readings.value;
      this.card.examples = this.examples.value;
      this.card.decks = this.deckForm.value;

      if (this.card.uid) {
        this.cardService.update(this.card);
      } else {
        this.cardService.add(this.card);
      }
      this.updateCard.emit(this.card);
      this.close();
    }
  }

  onDelete() {
    if (confirm('Karte löschen? Sie wird aus allen Decks entfernt in denen sie enthalten war.')) {
      this.cardService.delete(this.card.uid);
      this.deleteCard.emit();
      this.close();
    }
  }

  close() {
    this.router.navigate([{ outlets: { 'modal': null } }], {
      // relativeTo: this.activatedRoute.parent
    });
    // this.meta.removeTag();
  }

  private clickOutside(target) {
    let clickInSearch = false;
    if (this.toggleSearch) {
      clickInSearch = this.searchWindow.nativeElement.contains(target);
    }
    if (!this.editWindow.nativeElement.contains(target) && !clickInSearch) {
      this.close();
    }
  }

  @HostListener('document:mousedown', ['$event.target']) mousedown(target) {
    this.clickOutside(target);
  }
  @HostListener('document:touchstart', ['$event.target']) touchdown(target) {
    this.clickOutside(target);
  }
}
