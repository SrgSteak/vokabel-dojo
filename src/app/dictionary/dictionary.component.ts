import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../core/auth.service';
import { CardInterface } from '../core/entities/card-interface';
import { FLY_IN_OUT_ANIMATION } from '../core/animations/modal.animation';
import { Card } from '../core/entities/card';
import { CardService } from '../core/services/card.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import FuzzySearch from 'fuzzy-search';
import { FeatherModule } from 'angular-feather';
import { WordListComponent } from '../shared/word-list/word-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FeatherModule, WordListComponent],
  animations: [
    FLY_IN_OUT_ANIMATION
  ]
})
export class DictionaryComponent implements OnInit, OnDestroy {

  @HostBinding('@flyInOutTrigger') flyInOutTrigger = 'in';
  user: User;
  results: Card[] = [];
  searchForm = new FormControl('');

  private searchFormSub: Subscription;
  private userSub: Subscription;
  private cardSub: Subscription;
  private cards: Card[] = [];

  constructor(private router: Router, private auth: AuthService, private cardService: CardService) { }

  ngOnInit() {
    this.userSub = this.auth.user.subscribe(user => {
      this.user = user;
    });
    this.cardSub = this.cardService.allPublicCards().subscribe(cards => {
      this.cards = cards.map(card => Card.createFromCardInterface(card));
    });
    this.searchFormSub = this.searchForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => a === b)
    ).subscribe(() => {
      this.updateFilter();
    });
  }

  ngOnDestroy(): void {
    this.searchFormSub?.unsubscribe();
    this.cardSub?.unsubscribe();
  }

  private updateFilter() {
    if (this.searchForm.value) {
      const searcher = new FuzzySearch(this.cards, ['german', 'japanese', 'examples.german', 'examples.japanese', 'examples.reading', 'japanese_readings', 'chinese_readings'], {
        caseSensitive: false,
      });
      this.results = searcher.search(this.searchForm.value);
    } else {
      this.results = [];
    }
  }

  editCard(card: CardInterface) {
    this.auth.user.subscribe(user => {
      this.router.navigate([{ outlets: { modal: ['card', card.uid] } }]);
    });
  }

}
