import { Component, OnInit } from '@angular/core';
import { SyllablesService } from 'src/app/syllables.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  display = 'hiragana';

  constructor(public syllablesService: SyllablesService) { }

  ngOnInit() {
  }

}
