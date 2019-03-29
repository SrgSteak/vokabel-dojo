import { Component, OnInit } from '@angular/core';
import { SyllablesService } from 'src/app/syllables.service';
import { syllableFlashcard } from 'src/app/interfaces/syllable-flashcard.interface';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  display = 'hiragana';
  syllables: any;
  showSubmenu = false;

  constructor(public syllablesService: SyllablesService) {
    console.log(syllablesService.getForRows(['a']));
    this.syllables = {
      a: syllablesService.getForRows(['a']),
      s: syllablesService.getForRows(['s']),
      t: syllablesService.getForRows(['t']),
      na: syllablesService.getForRows(['na']),
      h: syllablesService.getForRows(['h']),
      m: syllablesService.getForRows(['m']),
      y: syllablesService.getForRows(['y']),
      r: syllablesService.getForRows(['r']),
      w: syllablesService.getForRows(['w']),
      n: syllablesService.getForRows(['n']),
    };

  }

  ngOnInit() {
  }

}
