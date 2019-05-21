import { Component, OnInit } from '@angular/core';
import { CardService } from 'src/app/core/services/card.service';
import { CardInterface } from 'src/app/core/entities/card-interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  cards = [];

  constructor(cardService: CardService) {
    cardService.loadAll().snapshotChanges().subscribe(data => {
      this.cards = data.map(e => {
        const card = e.payload.doc.data() as CardInterface;
        card.uid = e.payload.doc.id;
        return card;
      })
    })
  }

  ngOnInit() {
  }

}
