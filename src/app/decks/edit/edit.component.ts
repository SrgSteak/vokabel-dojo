import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { DeckService, Deck } from '../../core/services/deck.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CardService } from 'src/app/core/services/card.service';
import { Card } from 'src/app/core/entities/card';
import { AuthService, User } from 'src/app/core/auth.service';
import { Subscription } from 'rxjs';
import { FLY_IN_OUT_ANIMATION } from 'src/app/core/animations/modal.animation';

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

  deck: Deck;
  user: User;

  userSub: Subscription;
  deckSub: Subscription;
  routeSub: Subscription;

  deckForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['']
  });

  options = {
    fieldSeparator: ';',
    showLabels: false,
    headers: ['japanese', 'reading', 'german'],
    useBom: false,
    removeNewLines: false
  };
  data = [
    {
      japanese: "綺麗",
      reading: "きれい",
      german: "schön"
    },
  ];


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
        if (params.has('uid')) {
          this.deckSub = this.DeckService.get(params.get('uid')).subscribe(deck => {
            this.deck = deck;
            if (deck) {
              this.deck.uid = params.get('uid');
              if (this.user.role == 'admin' || this.user.uid == this.deck.author) {
              } else {
                this.router.navigate(['/decks/', this.deck.uid]);
              }
              this.deckForm.get('name').setValue(this.deck.name);
              this.deckForm.get('description').setValue(this.deck.description);
            }
          });
        } else {
          this.deck = { name: '', description: '', author: '', uid: '', numberCards: 0 };
        }
      });
    })
  }

  ngOnDestroy() {
    if (this.userSub) { this.userSub.unsubscribe(); }
    if (this.routeSub) { this.routeSub.unsubscribe(); }
    if (this.deckSub) { this.deckSub.unsubscribe(); }
  }

  onSubmit() {
    if (this.deckForm.valid) {
      this.deck.name = this.deckForm.get('name').value;
      this.deck.description = this.deckForm.get('description').value;
      this.deck.author = this.user.role == 'admin' ? '' : this.user.uid;
      if (this.deck.uid) {
        this.DeckService.update(this.deck.uid, this.deck);
        this.router.navigate([{ outlets: { primary: ['decks', this.deck.uid], modal: null } }]);
      } else {
        this.DeckService.add(this.deck).then(reference => {
          this.router.navigate([{ outlets: { primary: ['decks', reference.id], modal: null } }]);
        })
      }
    } else {
      this.deckForm.markAsTouched();
    }
  }

  onDelete() {
    if (confirm('Deck löschen? Lernkarten bleiben erhalten.')) {
      this.DeckService.delete(this.deck.uid);
      this.router.navigate([{ outlets: { primary: ['decks'], modal: null } }]);
    }
  }

  onDeleteWithCards() {
    if (confirm('Deck und alle enthaltenen Lernkarten löschen?')) {
      this.CardService.deleteForDeck(this.deck.uid);
      this.DeckService.delete(this.deck.uid);
      this.router.navigate([{ outlets: { primary: ['decks'], modal: null } }]);
    }
  }

  importCSVCards(input: HTMLInputElement): void {
    if (input.files && input.files.length) {
      const fileReader = new FileReader();
      fileReader.onload = this.onFileLoad();
      for (let index = 0; index < input.files.length; index++) {
        fileReader.readAsText(input.files[index], "UTF-8");
      }
    }
  }

  private onFileLoad() {
    return (file) => {
      const csvSeparator = ';';
      const csv = [];
      const lines = file.target.result.split('\r');
      lines.forEach(element => {
        const cols: string[] = element.split(csvSeparator);
        csv.push(cols);
      });
      csv.forEach(line => {
        if (line.japanese !== 'japanese') {
          const card = new Card();
          card.japanese = line[0];
          card.japanese_readings = line[1].split(',');
          card.german = line[2].split(',');
          // card.decks.push(this.deck.uid);
          this.CardService.add(card);
        }
      });
    }
  };
}
