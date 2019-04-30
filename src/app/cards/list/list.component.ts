import { Component, OnInit } from '@angular/core';
import { CardService, Card } from 'src/app/core/services/card.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  cards = [];

  constructor(private cardService: CardService) {
    cardService.loadAll().snapshotChanges().subscribe(data => {
      this.cards = data.map(e => {
        const card = e.payload.doc.data() as Card;
        card.uid = e.payload.doc.id;
        return card;
      })
    })
  }

  ngOnInit() {
  }

}
