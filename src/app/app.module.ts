import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LearnComponent } from './learn/learn.component';
import { QuizComponent } from './quiz/quiz.component';
import { MenuComponent } from './menu/menu.component';
import { VocabularyService } from './vocabulary.service';
import { WordQuizComponent } from './words/word-quiz/word-quiz.component';
import { FlashcardService } from './flashcard.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AboutComponent } from './about/about.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { NotificationcenterComponent } from './notificationcenter/notificationcenter.component';
import { OverviewComponent } from './syllables/overview/overview.component';
import { WordListComponent } from './words/word-list/word-list.component';
import { WordGridComponent } from './words/word-grid/word-grid.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ModalComponent } from './shared/modal/modal.component';
import { NumbersComponent } from './numbers/numbers.component';
import { NumberPipe } from './shared/pipes/number.pipe';
import { CoreModule } from './core/core.module';
import { AuthGuard } from './core/auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DecksComponent } from './decks/decks.component';
import { EditComponent } from './decks/edit/edit.component';
import { ListComponent as CardListComponent } from './cards/list/list.component';
import { EditComponent as CardEditComponent } from './cards/edit/edit.component';
import { ShowComponent } from './decks/show/show.component';
import { NewCardComponent } from './decks/new-card/new-card.component';

@NgModule({
  imports: [
    CoreModule,
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', pathMatch: 'full', component: WelcomeComponent },
      { path: 'quiz', component: QuizComponent },
      { path: 'learn', component: LearnComponent },
      { path: 'syllables/overview', component: OverviewComponent },
      { path: 'word-quiz', redirectTo: 'word-quiz/hiragana' },
      { path: 'word-quiz/:type', component: WordQuizComponent },
      { path: 'word-grid/:type', component: WordGridComponent },
      { path: 'word-list', component: WordListComponent },
      { path: 'about', component: AboutComponent },
      { path: 'numbers', component: NumbersComponent, canActivate: [AuthGuard] },
      { path: 'user', component: UserProfileComponent },
      // deck routes
      { path: 'decks', component: DecksComponent },
      { path: 'decks/new', component: EditComponent },
      { path: 'decks/edit/:uid', component: EditComponent },
      { path: 'decks/:uid', redirectTo: 'decks/:uid/list' },
      { path: 'decks/:uid/:mode', component: ShowComponent },
      // card routes
      { path: 'cards', component: CardListComponent },
      { path: 'cards/new', component: CardEditComponent },
      { path: 'cards/edit/:uid', component: CardEditComponent }
    ], { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    // automatically registered by pwa install
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    // noSQL Database where all subscriptions are stored (to push them from the 'server')
    AngularFireModule.initializeApp(environment.firebaseConfig, 'Vokabeldojo'),
    AngularFirestoreModule,
    AngularFireStorageModule, // Only required for storage features
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  declarations: [
    AppComponent,
    LearnComponent,
    QuizComponent,
    MenuComponent,
    WordQuizComponent,
    AboutComponent,
    NotificationcenterComponent,
    OverviewComponent,
    WordListComponent,
    WordGridComponent,
    WelcomeComponent,
    ModalComponent,
    NumbersComponent,
    NumberPipe,
    UserProfileComponent,
    DecksComponent,
    EditComponent,
    CardListComponent,
    CardEditComponent,
    ShowComponent,
    NewCardComponent
  ],
  bootstrap: [AppComponent],
  providers: [VocabularyService, FlashcardService]
})
export class AppModule { }
