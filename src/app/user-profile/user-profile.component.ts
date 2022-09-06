import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CardService } from '../core/services/card.service';
import { DeckService } from '../core/services/deck.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(public auth: AuthService, public cardService: CardService, public deckService: DeckService, private router: Router) { }

  ngOnInit() {
  }

  deleteAccount() {
    if (confirm('ACHTUNG: Diesen Account wirklich löschen? Das kann NICHT rückgängig gemacht werden!')) {
      this.auth.deleteAccount();
    }
  }

  promptMagicLink() {
    this.router.navigate(['/user', { outlets: { modal: ['magic-link'] } }]);
  }
}
