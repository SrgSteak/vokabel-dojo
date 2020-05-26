import { Component, OnInit } from '@angular/core';
import { DeckService, Deck } from '../../../core/services/deck.service';
import { AuthService } from '../../../core/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  decks = [];

  constructor(DeckService: DeckService, AuthService: AuthService, private title: Title) {
    DeckService.loadAll().snapshotChanges().subscribe(data => {
      this.decks = data.map(e => {
        const deck = e.payload.doc.data() as Deck;
        deck.uid = e.payload.doc.id;
        return deck;
      })
    });
  }

  ngOnInit() {
    this.title.setTitle('Vokabeldojo | Alle Decks');
  }
}
