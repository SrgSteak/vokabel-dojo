import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from '../shared/menu/menu.module';
import { RouterModule } from '@angular/router';
import { QuizOptionsComponent } from './quiz-options/quiz-options.component';
import { QuizResultsComponent } from './quiz-results/quiz-results.component';
import { WordGridComponent } from './word-grid/word-grid.component';
import { WordLearnComponent } from './word-learn/word-learn.component';
import { WordQuizComponent } from './word-quiz/word-quiz.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { WordListComponent } from '../shared/word-list/word-list.component';
import { DecknamePipe } from '../pipes/deckname.pipe';

@NgModule({
  declarations: [
    // ChooseModeComponent,
    QuizOptionsComponent,
    QuizResultsComponent,
    WordGridComponent,
    WordLearnComponent,
    WordQuizComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MenuModule,
    CoreModule,
    WordListComponent,
    DecknamePipe,
    RouterModule.forChild([
      {
        path: ':uid/learn',
        component: WordLearnComponent
      },
      {
        path: ':uid/quiz',
        component: WordQuizComponent
      },
      {
        path: ':uid/grid',
        component: WordGridComponent
      }
    ])
  ]
})
export class LearnModule { }
