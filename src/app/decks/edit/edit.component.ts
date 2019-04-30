import { Component, OnInit } from '@angular/core';
import { DeckService, Deck } from '../../core/services/deck.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

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
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('uid')) {
        this.DeckService.get(params.get('uid')).snapshotChanges().subscribe(data => {
          this.deck = data.payload.data();
          this.deck.uid = data.payload.id;
          this.deckForm.get('name').setValue(this.deck.name);
          this.deckForm.get('description').setValue(this.deck.description);
        });
      } else {
        this.deck = { name: '', description: '', author: '', uid: '' };
      }
    });
  }

  onSubmit() {
    this.deck.name = this.deckForm.get('name').value;
    this.deck.description = this.deckForm.get('description').value;
    if (this.deck.uid) {
      this.DeckService.update(this.deck.uid, this.deck);
      this.router.navigate(['/decks', this.deck.uid]);
    } else {
      this.DeckService.add(this.deck).then(reference => {
        this.router.navigate(['/decks', reference.id]);
      })
    }
  }

  onDelete() {
    if (confirm('Deck löschen? Lernkarten bleiben erhalten.')) {
      this.DeckService.delete(this.deck.uid);
      this.router.navigate(['/decks']);
    }
  }

}
