import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { CardService } from '../core/services/card.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(public auth: AuthService, public cardService: CardService) { }

  ngOnInit() {
  }

  migrate() {
    this.cardService.migrateDeckIds();
  }
}
