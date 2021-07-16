import { Component, OnInit, Output, EventEmitter, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { CardService } from 'src/app/core/services/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Deck, DeckService } from 'src/app/core/services/deck.service';
import { CardInterface } from 'src/app/core/entities/card-interface';
import { Card } from 'src/app/core/entities/card';
import { CardType, WordType, VerbType, AdjectiveType } from 'src/app/core/entities/card-type';
import { FLY_IN_OUT_ANIMATION, ROLL_IN_OUT_ANIMATION } from 'src/app/core/animations/modal.animation';
import { Subscription, Observable, Subject } from 'rxjs';
import { switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { AuthService, User } from 'src/app/core/auth.service';

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

  user: User;
  card: CardInterface;
  deck: Deck;
  createMode = false;
  showWordTypes = CardType.simple;
  cardForm = this.prepareCardForm();

  phrase$ = new Subject<string>();
  suggestions: Observable<Array<Deck>> = this.phrase$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((phrase: string) => {
      if (this.user.role == 'admin') {
        return this.deckService.findByName(phrase);
      } else {
        return this.deckService.findByNameForUser(this.user.uid, phrase);
      }
    }
    ));

  cardTypeToggle = false;
  wordTypeToggle = false;
  verbTypeToggle = false;
  adjectiveTypeToggle = false;
  toggleSearch = false;
  repeat = false;

  private cardTypeSub: Subscription;
  private routeSub: Subscription;
  private authSub: Subscription;
  private deckSub: Subscription;
  private cardSub: Subscription;
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
    return this.cardForm.get('deck_uids') as FormArray;
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

  get information() {
    return this.cardForm.get('information') as FormControl;
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
    private authService: AuthService,
    private cardService: CardService,
    private deckService: DeckService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.cardTypeSub = this.cardType.valueChanges.subscribe((value: CardType) => {
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
    this.user = this.authService.getUser();
    this.authSub = this.authService.user.subscribe(_user => {
      this.user = _user;
    });
    this.routeSub = this.route.paramMap.subscribe(params => {
      if (params.has('uid')) { // edit card
        this.cardSub = this.cardService.getCard(params.get('uid')).subscribe(data => {
          this.card = data
          if (this.user.role != 'admin' && this.user.uid != this.card.author) {
            this.router.navigate(['/']);
          }
          // prefill form;
          this.cardForm.get('japanese').setValue(this.card.japanese);
          this.cardForm.get('cardType').setValue(this.card.cardType ? '1' : '0');
          this.german.clear();
          this.card.german.forEach(german => {
            this.addReading(this.german, german);
          })

          this.japanese_readings.clear();
          this.card.japanese_readings.forEach(reading => {
            this.addReading(this.japanese_readings, reading);
          });

          this.chinese_readings.clear();
          this.card.chinese_readings.forEach(reading => {
            this.addReading(this.chinese_readings, reading);
          });

          this.examples.clear();
          if (this.card.examples) {
            this.card.examples.forEach(example => {
              this.addExample(this.examples, example);
            })
          }

          this.information.setValue(this.card.information);

          this.deckForm.clear();
          if (this.card.deck_uids) {
            this.card.deck_uids.forEach(deck_uid => {
              this.addReading(this.deckForm, deck_uid)
            });
          }
          this.wordTypeToggle = false;
          this.adjectiveTypeToggle = false;
          this.verbTypeToggle = false;
        })
      } else { // create card
        this.createMode = true;
        this.card = { german: [], decks: [], cardType: CardType.simple };
      }
      if (params.has('deckuid')) { // preselect deck for new cards
        this.addReading(this.deckForm, params.get('deckuid'));
        this.deckSub = this.deckService.get(params.get('deckuid')).subscribe((_deck) => {
          this.deck = _deck;
          this.card.decks.push({ name: this.deck.name, uid: this.deck.uid });
        });
      }
    })
  }

  ngOnDestroy() {
    if (this.cardTypeSub) { this.cardTypeSub.unsubscribe(); }
    if (this.cardSub) { this.cardSub.unsubscribe(); }
    if (this.routeSub) { this.routeSub.unsubscribe(); }
    if (this.deckSub) { this.deckSub.unsubscribe(); }
    if (this.authSub) { this.authSub.unsubscribe(); }
    if (this.verbSub) { this.verbSub.unsubscribe(); }
    if (this.adjectiveSub) { this.adjectiveSub.unsubscribe(); }
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
      const uidForm = new FormControl('', Validators.required);
      uidForm.setValue(deck.uid);
      this.deckForm.push(uidForm);
    }
  }

  removeDeckFromCard(index: number) {
    this.deckForm.removeAt(index);
  }

  private prepareCardForm() {
    return this.fb.group({
      cardType: ['0', Validators.required],
      german: this.fb.array([]),
      japanese: ['', Validators.required],
      japanese_readings: this.fb.array([]),
      chinese_readings: this.fb.array([]),
      deck_uids: this.fb.array([]),
      examples: this.fb.array([]),
      information: ['']
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
      this.card.author = this.user.role == 'admin' ? '' : this.user.uid;
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
      this.card.deck_uids = this.deckForm.value;
      this.card.information = this.information.value;
      if (this.card.uid) {
        this.cardService.update(this.card);
      } else {
        this.cardService.add(this.card);
      }
      this.updateCard.emit(this.card);
      if (this.repeat) {
        this.card = { german: [], decks: [], cardType: CardType.simple };
        this.japanese.reset();
        this.german.clear();
        this.japanese_readings.clear();
        this.chinese_readings.clear();
        this.examples.clear();
        this.information.reset();
      } else {
        this.close();
      }
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
    });
  }
}
