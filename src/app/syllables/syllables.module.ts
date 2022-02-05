import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { LearnComponent } from './learn/learn.component';
import { QuizComponent } from './quiz/quiz.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    OverviewComponent,
    LearnComponent,
    QuizComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild([
      {
        path: '',
        component: OverviewComponent
      },
      {
        path: 'learn',
        component: LearnComponent
      },
      {
        path: 'quiz',
        component: QuizComponent
      }
    ])
  ]
})
export class SyllablesModule { }
