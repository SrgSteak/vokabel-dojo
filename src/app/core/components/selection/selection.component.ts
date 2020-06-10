import { Component, OnInit } from '@angular/core';
import { SelectService } from '../../services/select.service';
import { DeckService, Deck } from '../../services/deck.service';
import { AuthService, User } from '../../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {

  private user: User;
  $decks;
  createDeckForm = this.fb.group({
    name: ['', [Validators.required]]
  });

  constructor(
    private router: Router,
    public selectService: SelectService,
    private deckService: DeckService,
    private authService: AuthService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.authService.user.subscribe(_user => {
      this.user = _user;
      this.$decks = this.deckService.getAllDecksForUser(this.user.uid).valueChanges();
    });
  }

  clear() {
    if (confirm('Auswahl wirklich leeren?')) {
      this.selectService.clear();
    }
  }

  close() {
    this.router.navigate([{ outlets: { 'modal': null } }]);
  }

  submitNewDeck() {
    if (this.createDeckForm.valid) {
      let deck: Deck = {
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
