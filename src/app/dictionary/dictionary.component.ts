import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../core/auth.service';
import { CardInterface } from '../core/entities/card-interface';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit {

  user: User;
  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
    });
  }

  editCard(card: CardInterface) {
    this.auth.user.subscribe(user => {
      this.router.navigate([{ outlets: { modal: ['card', card.uid] } }]);
    });
  }

}
