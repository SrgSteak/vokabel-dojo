import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardService } from 'src/app/core/services/card.service';
import { Card } from 'src/app/core/entities/card';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService, User } from 'src/app/core/auth.service';
import { MenuService } from 'src/app/shared/menu/menu.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  user: User;
  cards = [];
  private cardSub: Subscription;
  private dataSub: Subscription;
  private authSub: Subscription;

  constructor(
    private cardService: CardService,
    private route: ActivatedRoute,
    private authService: AuthService,
    protected menuService: MenuService
  ) {}

  ngOnInit() {
    this.authSub = this.authService.user.subscribe(_user => {
      this.user = _user
      this.dataSub = this.route.data.subscribe(data => {
        if (data.showUserCards) {
          this.cardSub = this.cardService.allCardsForUser(this.user.uid).subscribe(data => {
            this.cards = data;
          })
        } else {
          this.cardSub = this.cardService.allPublicCards().subscribe(data => {
            this.cards = data.map(e => {
              const card = Card.createFromCardInterface(e);
              return card;
            })
          })
        }
      });
    })
  }

  ngOnDestroy() {
    this.cardSub?.unsubscribe();
    this.dataSub?.unsubscribe();
    this.authSub?.unsubscribe();
  }

  deleteAll() {
    if (confirm('WIRKLICH alle deine Karten löschen?')) {
      this.cardService.deleteForUser(this.user.uid);
    };
  }

}
