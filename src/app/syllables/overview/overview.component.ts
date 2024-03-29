import { Component, OnInit } from '@angular/core';
import { SyllablesService } from 'src/app/syllables.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MenuService } from 'src/app/shared/menu/menu.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  display = 'hiragana';
  syllables: any;
  handakuten: any;
  dakuten: any;
  showSubmenu = false;

  settingsForm = new FormGroup({
    font: new FormControl('serif')
  });

  get font() {
    return this.settingsForm.get('font').value;
  }

  constructor(public syllablesService: SyllablesService, protected menuService: MenuService) {
    this.syllables = {
      a: syllablesService.getForRows(['a']),
      k: syllablesService.getForRows(['k']),
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
    this.handakuten = {
      p: syllablesService.getForRows(['handakuten_h'])
    };
    this.dakuten = {
      b: syllablesService.getForRows(['dakuten_h']),
      g: syllablesService.getForRows(['dakuten_k']),
      d: syllablesService.getForRows(['dakuten_t']),
      z: syllablesService.getForRows(['dakuten_s'])
    };
  }

  ngOnInit() {
  }

}