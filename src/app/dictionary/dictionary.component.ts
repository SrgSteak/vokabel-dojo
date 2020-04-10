import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../core/auth.service';
import { CardInterface } from '../core/entities/card-interface';
import { FLY_IN_OUT_ANIMATION } from '../core/animations/modal.animation';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss'],
  animations: [
    FLY_IN_OUT_ANIMATION
  ]
})
export class DictionaryComponent implements OnInit {

  @HostBinding('@flyInOutTrigger') flyInOutTrigger = 'in';
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
