import { Component, OnInit, Output, EventEmitter, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { CardService } from 'src/app/core/services/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Deck, DeckService } from 'src/app/core/services/deck.service';
import { CardInterface } from 'src/app/core/entities/card-interface';
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

  cardForm = this.fb.group({
    uid: [''],
    wordType: [undefined],
    verbType: [''],
    verbContext: [''],
    adjectiveType: [''],
    german: this.fb.array([]),
    japanese: ['', Validators.required],
    japanese_readings: this.fb.array([]),
    chinese_readings: this.fb.array([]),
    examples: this.fb.array([]),
    createdAt: [''],
    updatedAt: [''],
    deck_uids: this.fb.array([]),
    information: [''],
    author: ['']
  });

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

  wordTypeToggle = false;
  verbTypeToggle = false;
  adjectiveTypeToggle = false;
  toggleSearch = false;
  repeat = false;
  uid: string;
  user: User;

  private deckUid: string;
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
    this.wordSub = this.wordType.valueChanges.subscribe((value: WordType) => {
      switch (value) {
        case WordType.verb: // remove all wordtypes except verbType
          // this.removeField('adjectiveType');
          // this.addField('verbType', this.card.verbType ? this.card.verbType : null);
          this.verbTypeToggle = true;
          this.verbSub = this.verbType.valueChanges.subscribe((value: VerbType) => {
            this.verbTypeToggle = false;
          });
          break;

        case WordType.adjective: // remove all wordtypes except adjectiveType
          if (this.verbSub) {
            this.verbSub.unsubscribe();
          }
          // this.removeField('verbType');
          // this.addField('adjectiveType', this.card.adjectiveType ? this.card.adjectiveType : null);
          this.adjectiveTypeToggle = true;
          this.adjectiveSub = this.adjectiveType.valueChanges.subscribe((value: AdjectiveType) => {
            this.adjectiveTypeToggle = false;
          });
          break;
        default: // remove all fields
          // this.removeField('adjectiveType');
          // this.removeField('verbType');
          if (this.verbSub) {
            this.verbSub.unsubscribe();
          }
          if (this.adjectiveSub) {
            this.adjectiveSub.unsubscribe();
          }

          break;
      }
      this.wordTypeToggle = false;
    });
    this.authSub = this.authService.user.subscribe(_user => {
      this.user = _user;
      this.routeSub = this.route.paramMap.subscribe(params => {
        this.deckUid = params.get('deckuid');
        if (params.has('uid')) { // edit card
          this.uid = params.get('uid');
          this.cardSub = this.cardService.getCard(params.get('uid')).subscribe(data => {
            this.cardForm.patchValue(data);
            if (_user.role != 'admin' && _user.uid != data.author) {
              this.router.navigate(['/']);
            }
            // prefill form;
            // this.cardForm.get('japanese').setValue(this.card.japanese);
            this.german.clear();
            data.german.forEach(german => {
              this.addReading(this.german, german);
            })

            this.japanese_readings.clear();
            data.japanese_readings.forEach(reading => {
              this.addReading(this.japanese_readings, reading);
            });

            this.chinese_readings.clear();
            data.chinese_readings.forEach(reading => {
              this.addReading(this.chinese_readings, reading);
            });

            this.examples.clear();
            if (data.examples) {
              data.examples.forEach(example => {
                this.addExample(this.examples, example);
              })
            }

            // this.information.setValue(this.card.information);

            this.deckForm.clear();
            if (data.deck_uids) {
              data.deck_uids.forEach(deck_uid => {
                this.addReading(this.deckForm, deck_uid)
              });
            }
            this.wordTypeToggle = false;
            this.adjectiveTypeToggle = false;
            this.verbTypeToggle = false;
          })
        } else { // create card
          if (params.has('deckuid') && !this.deckForm.length) { // preselect deck for new card
            this.addReading(this.deckForm, params.get('deckuid'));
          }
        }
      })
    });
  }

  ngOnDestroy() {
    if (this.authSub) { this.authSub.unsubscribe(); }
    if (this.routeSub) { this.routeSub.unsubscribe(); }
    if (this.cardTypeSub) { this.cardTypeSub.unsubscribe(); }
    if (this.cardSub) { this.cardSub.unsubscribe(); }
    if (this.deckSub) { this.deckSub.unsubscribe(); }
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
      this.cardForm.get('author').setValue(this.user.role == 'admin' ? '' : this.user.uid);
      this.cardService.write(this.cardForm.value).then(reference => {
        // prepare empty form and patch up some values or close the modal
        if (this.repeat) {
          this.cardForm.reset();
          this.cardForm.get('author').setValue(this.user.uid)
          const uidForm = new FormControl('', Validators.required);
          uidForm.setValue(this.deckUid);
          this.deckForm.clear();
          this.deckForm.push(uidForm);
        } else {
          this.close();
        }
      })
    }
  }

  onDelete() {
    if (confirm('Karte löschen? Sie wird aus allen Decks entfernt in denen sie enthalten war.')) {
      this.cardService.delete(this.uid);
      this.deleteCard.emit();
      this.close();
    }
  }

  close() {
    this.router.navigate([{ outlets: { 'modal': null } }], {
      relativeTo: this.route.parent
    });
  }
}
