import { Component, OnInit } from '@angular/core';
import { SyllablesService } from 'src/app/syllables.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  display = 'hiragana';
  showSubmenu = false;

  constructor(public syllablesService: SyllablesService) { }

  ngOnInit() {
  }

}
