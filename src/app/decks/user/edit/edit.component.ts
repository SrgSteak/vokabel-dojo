import { Component, OnInit } from '@angular/core';
import { DeckService, Deck } from '../../../core/services/deck.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  deck: Deck;

  deckForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['']
  });

  constructor(
    private DeckService: DeckService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('uid')) {
        this.auth.user.subscribe(user => {
          this.DeckService.getDeckForUser(params.get('uid'), user.uid).snapshotChanges().subscribe(data => {
            this.deck = data.payload.data();
            this.deck.uid = data.payload.id;
            this.deckForm.get('name').setValue(this.deck.name);
            this.deckForm.get('description').setValue(this.deck.description);
          });
        });
      } else {
        this.deck = { name: '', description: '', author: '', uid: '', numberCards: 0 };
      }
    });
  }

  onSubmit() {
    this.deck.name = this.deckForm.get('name').value;
    this.deck.description = this.deckForm.get('description').value;
    this.auth.user.subscribe(user => {
      if (this.deck.uid) {
        this.DeckService.update(this.deck.uid, this.deck, user.uid);
        this.router.navigate(['/user/decks', this.deck.uid, 'list']);
      } else {
        this.DeckService.add(this.deck, user.uid).then(reference => {
          this.router.navigate(['/user/decks', reference.id, 'list']);
        })
      }
    });
  }

  onDelete() {
    if (confirm('Deck löschen? Lernkarten werden mitgelöscht')) {
      this.auth.user.subscribe(user => {
        this.DeckService.delete(this.deck.uid, user.uid);
        this.router.navigate(['/user/decks']);
      });
    }
  }

}
