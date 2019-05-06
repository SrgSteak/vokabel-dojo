import { Component, OnInit } from '@angular/core';
import { CardService, Card } from 'src/app/core/services/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Deck, DeckService } from 'src/app/core/services/deck.service';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-user-card-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditCardComponent implements OnInit {

  user_uid: string;
  deck_uid: string;
  card: Card;
  decks: Array<Deck>;
  cardForm = this.fb.group({
    german: ['', [Validators.required]],
    romaji: [''],
    hiragana: [''],
    katakana: [''],
    kanji: [''],
    // decks: this.fb.array([])
  });

  get deckForm() {
    return this.cardForm.get('decks') as FormArray;
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
            this.cardForm.get('german').setValue(this.card.german);
            this.cardForm.get('hiragana').setValue(this.card.hiragana);
            this.cardForm.get('katakana').setValue(this.card.katakana);
            this.cardForm.get('kanji').setValue(this.card.kanji);
            this.cardForm.get('romaji').setValue(this.card.romaji);
          })
        } else {
          this.card = { german: '', decks: [] };
        }
      })
      // this.deckService.getAllDecksForUser(user.uid).snapshotChanges().subscribe(data => {
      //   this.decks = data.map(e => {
      //     const deck = e.payload.doc.data() as Deck;
      //     deck.uid = e.payload.doc.id;
      //     return deck;
      //   });
      //   this.decks.forEach(deck => {
      //     const control = this.fb.control('');
      //     if (this.card.decks && this.card.decks.includes(deck.uid)) {
      //       control.setValue(true);
      //     }
      //     this.deckForm.push(control);
      //   });
      // });
    });
  }

  onSubmit() {
    if (this.cardForm.valid) {
      this.card.german = this.cardForm.get('german').value;
      this.card.hiragana = this.cardForm.get('hiragana').value;
      this.card.katakana = this.cardForm.get('katakana').value;
      this.card.romaji = this.cardForm.get('romaji').value;
      this.card.kanji = this.cardForm.get('kanji').value;

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
