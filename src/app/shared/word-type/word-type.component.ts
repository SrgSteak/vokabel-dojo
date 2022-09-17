import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdjectiveType, VerbType, WordType } from 'src/app/core/entities/card-type';
import { CardInterface } from 'src/app/core/entities/card-interface';

@Component({
  selector: 'app-word-type',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-type.component.html',
  styleUrls: ['./word-type.component.scss']
})
export class WordTypeComponent implements OnInit {

  get wordTypes() {
    return WordType;
  }

  get verbTypes() {
    return VerbType;
  }

  get adjectiveTypes() {
    return AdjectiveType;
  }

  @Input() card: CardInterface;

  constructor() { }

  ngOnInit(): void {
  }

}
