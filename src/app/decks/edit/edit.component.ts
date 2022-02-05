import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { DeckService, Deck } from '../../core/services/deck.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CardService } from 'src/app/core/services/card.service';
import { Card } from 'src/app/core/entities/card';
import { AuthService, User } from 'src/app/core/auth.service';
import { Subscription } from 'rxjs';
import { FLY_IN_OUT_ANIMATION } from 'src/app/core/animations/modal.animation';
import { DeckInterface } from 'src/app/core/entities/deck';

@Component({
  selector: 'app-deck-public-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  animations: [
    FLY_IN_OUT_ANIMATION
  ]
})
export class EditComponent implements OnInit, OnDestroy {

  @HostBinding('@flyInOutTrigger') flyInOutTrigger = 'in';

  user: User;

  userSub: Subscription;
  deckSub: Subscription;
  routeSub: Subscription;

  deckForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    description: [''],
    uid: [null],
    author: [''],
    createdAt: [''],
    updatedAt: ['']
  });

  uid: string;

  constructor(
    private authService: AuthService,
    private DeckService: DeckService,
    private CardService: CardService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {

  }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(_user => {
      this.user = _user;
      this.routeSub = this.route.paramMap.subscribe(params => {
        if (params.has('uid')) { // edit form
          this.uid = params.get('uid');
          this.deckSub = this.DeckService.getDeck(params.get('uid')).subscribe(deck => {
            if (deck) {
              if (this.user.role != 'admin' && this.user.uid != deck.author) {
                this.router.navigate(['/decks/', deck.uid]);
              }
              this.deckForm.patchValue(deck);
            }
          });
        }
      });
    })
  }

  ngOnDestroy() {
    if (this.userSub) { this.userSub.unsubscribe(); }
    if (this.routeSub) { this.routeSub.unsubscribe(); }
    if (this.deckSub) { this.deckSub.unsubscribe(); }
  }

  /**
   * write changes to the document store.
   * Will redirect to the document show on success
   */
  onSubmit() {
    if (this.deckForm.valid) {
      if (!this.deckForm.get('createdAt').value) {
        this.deckForm.get('createdAt').setValue(new Date());
      }
      if (!this.deckForm.get('author').value) {
        this.deckForm.get('author').setValue(this.user.role == 'admin' ? '' : this.user.uid);
      }
      this.DeckService.write(this.deckForm.value).then(reference => {
        this.router.navigate([{ outlets: { primary: [reference.id], modal: null } }], { relativeTo: this.route.parent });
      });
    } else {
      this.deckForm.markAsTouched();
    }
  }

  onDelete() {
    if (confirm('Deck löschen? Lernkarten bleiben erhalten.')) {
      this.DeckService.delete(this.uid);
      this.router.navigate([{ outlets: { primary: ['decks'], modal: null } }]);
    }
  }

  onDeleteWithCards() {
    if (confirm('Deck und alle enthaltenen Lernkarten löschen?')) {
      this.CardService.deleteForDeck(this.uid).then(() => {
        this.DeckService.delete(this.uid);
        this.router.navigate([{ outlets: { primary: ['decks'], modal: null } }]);
      });
    }
  }
}
