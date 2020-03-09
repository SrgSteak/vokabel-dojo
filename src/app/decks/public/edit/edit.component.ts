import { Component, OnInit } from '@angular/core';
import { DeckService, Deck } from '../../../core/services/deck.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CardService } from 'src/app/core/services/card.service';
import { Card } from 'src/app/core/entities/card';

@Component({
  selector: 'app-deck-public-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  deck: Deck;

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
    private DeckService: DeckService,
    private CardService: CardService,
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
        this.deck = { name: '', description: '', author: '', uid: '', numberCards: 0 };
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
      console.log(csv);
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
