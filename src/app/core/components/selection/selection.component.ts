import { Component, OnInit, HostBinding } from '@angular/core';
import { SelectService } from '../../services/select.service';
import { DeckService, Deck } from '../../services/deck.service';
import { AuthService, User } from '../../auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CardService } from '../../services/card.service';
import { Subscription } from 'rxjs';
import { FLY_IN_OUT_ANIMATION } from '../../animations/modal.animation';
import { DeckInterface } from '../../entities/deck';
import { FeatherModule } from 'angular-feather';
import { WordListComponent } from 'src/app/shared/word-list/word-list.component';
import { CoreModule } from '../../core.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss'],
  standalone: true,
  imports: [CommonModule, CoreModule, RouterModule, FeatherModule, WordListComponent],
  animations: [
    FLY_IN_OUT_ANIMATION
  ]
})
export class SelectionComponent implements OnInit {

  @HostBinding('@flyInOutTrigger') flyInOutTrigger = 'in';
  protected user: User;
  protected decks = [];
  private deckSub: Subscription;
  private authSub: Subscription;

  createDeckForm = this.fb.group({
    name: ['', [Validators.required]]
  });

  constructor(
    private router: Router,
    public selectService: SelectService,
    private cardService: CardService,
    private deckService: DeckService,
    private authService: AuthService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.authSub = this.authService.user.subscribe(_user => {
      this.user = _user;
      if (this.user) {
        this.deckSub = this.deckService.allDecksForUser(this.user.uid).subscribe(_decks =>
          this.decks = _decks);
      }
    });
  }

  ngOnDestroy() {
    this.deckSub?.unsubscribe();
    this.authSub?.unsubscribe();
  }

  clear() {
    if (confirm('Auswahl wirklich leeren?')) {
      this.selectService.clear();
    }
  }

  close() {
    this.router.navigate([{ outlets: { 'modal': null } }]);
  }

  addToDeck(deck: Deck) {
    if (confirm(`Auswahl an ${this.selectService.cards.length} Karten zum Deck ${deck.name} wirklich hinzufügen?`)) {
      this.selectService.cards.forEach(_card => {
        if (_card.author == this.user.uid) { // users card, add his card to his deck
          _card.deck_uids.push(deck.uid);
          _card.decks.push({ name: deck.name, uid: deck.uid });
          this.cardService.update(_card);
        } else { // not users card, copy!
          _card.deck_uids = [deck.uid];
          _card.decks = [{ name: deck.name, uid: deck.uid }]
          _card.author = this.user.uid;
          this.cardService.add(_card);
        }
      });
    }
  }

  submitNewDeck() {
    if (this.createDeckForm.valid) {
      let deck: DeckInterface = {
        uid: null,
        name: this.createDeckForm.get('name').value,
        description: '',
        author: this.user.uid,
        numberCards: 0
      };
      this.deckService.add(deck);
      this.createDeckForm.reset();
    }
  }
}
