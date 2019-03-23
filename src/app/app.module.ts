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
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { KatakanaComponent } from './words/katakana/katakana.component';
import { AboutComponent } from './about/about.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { NotificationcenterComponent } from './notificationcenter/notificationcenter.component';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'quiz' },
      { path: 'quiz', component: QuizComponent},
      { path: 'learn', component: LearnComponent },
      { path: 'word-quiz', component: WordQuizComponent },
      { path: 'about', component: AboutComponent }
    ]),
    // automatically registered by pwa install
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    // noSQL Database where all subscriptions are stored (to push them from the 'server')
    AngularFireModule.initializeApp(environment.firebaseConfig, 'Vokabeldojo'),
    AngularFirestoreModule,
    AngularFireStorageModule, // Only required for storage features
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  declarations: [ AppComponent, LearnComponent, QuizComponent, MenuComponent, WordQuizComponent, KatakanaComponent, AboutComponent, NotificationcenterComponent ],
  bootstrap:    [ AppComponent ],
  providers: [VocabularyService, FlashcardService]
})
export class AppModule { }
