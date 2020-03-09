import { Component, OnInit } from '@angular/core';
import { Card } from '../core/entities/card';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CardInterface } from '../core/entities/card-interface';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css']
})
export class DictionaryComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
  }

  editCard(card: CardInterface) {
    this.auth.user.subscribe(user => {
      this.router.navigate([{ outlets: { modal: ['card', card.uid] } }]);
      // if (user.role === 'admin') {
      //   this.router.navigate(['/', 'cards', 'edit', card.uid]);
      // }
    });
  }

}
