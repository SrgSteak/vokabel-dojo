import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'src/app/shared/menu/menu.module';
import { OnyomiPipe } from 'src/app/shared/pipes/onyomi.pipe';
import { HighlightPipe } from 'src/app/shared/pipes/highlight.pipe';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { GrammarService } from 'src/app/core/grammar.service';
import { GrammarInterface } from 'src/app/core/entities/grammar';
import { ExerciseComponent } from '../exercise/exercise.component';
import { IconsModule } from 'src/app/shared/card-info/icons.module';

@Component({
  selector: 'app-grammar-quick-sheet',
  standalone: true,
  imports: [CommonModule, MenuModule, OnyomiPipe, HighlightPipe, RouterModule, ExerciseComponent, IconsModule],
  templateUrl: './grammar-quick-sheet.component.html',
  styleUrls: ['./grammar-quick-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrammarQuickSheetComponent implements OnInit, OnDestroy {

  private routeSub: Subscription;
  private dataSub: Subscription;
  protected lession: GrammarInterface;

  constructor(private route: ActivatedRoute, private grammarService: GrammarService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      console.log('routerSub!')
      this.dataSub = this.grammarService.get(params.get('slug')).subscribe({ next: grammar => {
        console.log('RESULT', grammar);
        this.lession = grammar[0];
        this.cdr.markForCheck();
      }})
    })
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.dataSub?.unsubscribe();
  }

}
