import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { CardService } from '../core/services/card.service';
import { DeckService } from '../core/services/deck.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(public auth: AuthService, public cardService: CardService, public deckService: DeckService) { }

  ngOnInit() {
  }

  migrate() {
    // this.deckService.migrateUserDecks();
    // this.cardService.migrateAuthors();
    // this.cardService.migrateDeckIds();
  }
}
