import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { SyllablesService, flashcard } from '../../syllables.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/shared/menu/menu.service';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['learn.component.scss']
})
export class LearnComponent implements OnInit, OnDestroy {
  hiragana: Array<flashcard>;
  show = 0;
  displayLeft = 'hiragana';
  displayRight = 'german';
  displayMode = 'always';
  clicked = false;
  showSubmenu = false;
  formSub: Subscription;

  // settings
  filterForm = new FormGroup({
    row_a: new FormControl(''),
    row_k: new FormControl(''),
    row_s: new FormControl(''),
    row_t: new FormControl(''),
    row_na: new FormControl(''),
    row_h: new FormControl(''),
    row_m: new FormControl(''),
    row_y: new FormControl(''),
    row_r: new FormControl(''),
    row_w: new FormControl(''),
    row_n: new FormControl(''),
  });


  constructor(private syllablesService: SyllablesService, protected menuService: MenuService) {
    this.hiragana = syllablesService.getAll();
  }

  ngOnInit() {
    this.formSub = this.filterForm.valueChanges.subscribe(() => {
      this.setActiveRows();
    });
  }

  ngOnDestroy() {
    this.formSub?.unsubscribe();
  }

  setMode(mode: string) {
    this.displayMode = mode;
  }

  showNext() {
    if (this.displayMode === 'click' && this.clicked === false) {
      this.clicked = true;
    } else {
      this.show++;
      if (this.show >= this.hiragana.length) {
        this.show = 0;
      }
      if (this.displayMode == 'click') {
        this.clicked = false;
      }
    }
  }

  setActiveRows() {
    const rows = [];
    if (this.filterForm.get('row_a').value) {
      rows.push('a');
    }
    if (this.filterForm.get('row_k').value) {
      rows.push('k');
    }
    if (this.filterForm.get('row_s').value) {
      rows.push('s');
    }
    if (this.filterForm.get('row_t').value) {
      rows.push('t');
    }
    if (this.filterForm.get('row_na').value) {
      rows.push('na');
    }
    if (this.filterForm.get('row_h').value) {
      rows.push('h');
    }
    if (this.filterForm.get('row_m').value) {
      rows.push('m');
    }
    if (this.filterForm.get('row_y').value) {
      rows.push('y');
    }
    if (this.filterForm.get('row_r').value) {
      rows.push('r');
    }
    if (this.filterForm.get('row_w').value) {
      rows.push('w');
    }
    if (this.filterForm.get('row_n').value) {
      rows.push('n');
    }

    if (rows.length > 0) {
      this.hiragana = this.syllablesService.getForRows(rows);
    } else {
      this.hiragana = this.syllablesService.getAll();
    }
    this.show = -1;
    this.showNext();
  }

}
