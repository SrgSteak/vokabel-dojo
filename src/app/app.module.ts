import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LearnComponent } from './learn/learn.component';
import { QuizComponent } from './quiz/quiz.component';
import { MenuComponent } from './menu/menu.component';
import { VocabularyService } from './vocabulary.service';
import { WordQuizComponent } from './words/word-quiz/word-quiz.component';
import { FlashcardService } from './flashcard.service';

@NgModule({
  imports:      [ 
    BrowserModule, 
    FormsModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: '/quiz' },
      { path: 'quiz', component: QuizComponent },
      { path: 'learn', component: LearnComponent },
      { path: 'word-quiz', component: WordQuizComponent }
    ])
  ],
  declarations: [ AppComponent, LearnComponent, QuizComponent, MenuComponent, WordQuizComponent ],
  bootstrap:    [ AppComponent ],
  providers: [VocabularyService, FlashcardService]
})
export class AppModule { }
