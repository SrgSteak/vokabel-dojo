import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectService } from '../../services/select.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-selection-page',
  templateUrl: './selection-page.component.html',
  styleUrls: ['./selection-page.component.css']
})
export class SelectionPageComponent implements OnInit, OnDestroy {

  mode: string;
  routeSub: Subscription;

  get cards() {
    return this.selectionService.cards;
  }

  get loadingCards() {
    return this.selectionService.loading;
  }

  constructor(private selectionService: SelectService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(_params => {
      this.mode = _params.get('mode');
    });
  }

  ngOnDestroy() {
    if (this.routeSub) { this.routeSub.unsubscribe(); }
  }
}
