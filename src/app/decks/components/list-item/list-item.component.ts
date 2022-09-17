import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeckInterface } from 'src/app/core/entities/deck';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class ListItemComponent implements OnInit {

  @Input() deck: DeckInterface;
  @Input() displayBanner: boolean;

  public get isNew(): boolean {
    return this.deck.updatedAt?.seconds > (Date.now() / 1000) - 48 * 3600;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
