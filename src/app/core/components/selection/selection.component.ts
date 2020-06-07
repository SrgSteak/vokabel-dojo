import { Component, OnInit } from '@angular/core';
import { SelectService } from '../../services/select.service';
import { DeckService } from '../../services/deck.service';
import { AuthService, User } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {

  private user: User;

  constructor(private router: Router, public selectService: SelectService, private deckService: DeckService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.user.subscribe(_user => {
      this.user = _user;
    });
  }

  clear() {
    if (confirm('Auswahl wirklich leeren?')) {
      this.selectService.clear();
    }
  }

  close() {
    this.router.navigate([{ outlets: { 'modal': null } }]);
  }
}
