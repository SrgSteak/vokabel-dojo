import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { DecksComponent } from './decks/user/list/decks.component';
import { EditComponent } from './decks/user/edit/edit.component';
import { EditComponent as DeckPublicEdit } from './decks/public/edit/edit.component';
import { ListComponent as CardListComponent } from './cards/list/list.component';
import { EditComponent as CardEditComponent } from './cards/edit/edit.component';
import { ShowComponent } from './decks/user/show/show.component';
import { ShowComponent as DeckPublicShow } from './decks/public/show/show.component';
import { NewCardComponent } from './decks/user/new-card/new-card.component';
import { ListComponent } from './decks/public/list/list.component';
import { EditCardComponent } from './decks/user/edit-card/edit-card.component';
import { WordLearnComponent } from './words/word-learn/word-learn.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { Angular2CsvModule } from 'angular2-csv';
import { CalendarComponent } from './time/calendar/calendar.component';
import { CardInfoComponent } from './shared/card-info/card-info.component';
import { OnyomiPipe } from './shared/pipes/onyomi.pipe';
import { VerbTableComponent } from './shared/card-info/verb-table/verb-table.component';
import { AdjectiveTableComponent } from './shared/card-info/adjective-table/adjective-table.component';

@NgModule({
  imports: [
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', pathMatch: 'full', component: WelcomeComponent },
      { path: 'quiz', component: QuizComponent },
      { path: 'learn', component: LearnComponent },
      { path: 'dictionary', component: DictionaryComponent },
      { path: 'syllables/overview', component: OverviewComponent },
      { path: 'word-quiz', redirectTo: 'word-quiz/hiragana' },
      { path: 'word-quiz/:type', component: WordQuizComponent },
      { path: 'word-grid/:type', component: WordGridComponent },
      { path: 'word-list', component: WordListComponent },
      { path: 'about', component: AboutComponent },
      { path: 'numbers', component: NumbersComponent, canActivate: [AuthGuard] },
      { path: 'user', component: UserProfileComponent },

      // user deck routes
      { path: 'user/decks', component: DecksComponent },
      { path: 'user/decks/new', component: EditComponent, canActivate: [AuthGuard] },
      { path: 'user/decks/edit/:uid', component: EditComponent, canActivate: [AuthGuard] },
      { path: 'user/decks/:uid', pathMatch: 'full', redirectTo: '/user/decks/:uid/list' },
      { path: 'user/decks/:uid/:mode', component: ShowComponent, canActivate: [AuthGuard] },
      { path: 'user/decks/:deck_uid/cards/:card_uid/edit', component: EditCardComponent, canActivate: [AuthGuard] },

      // public deck routes
      { path: 'decks', component: ListComponent },
      { path: 'decks/new', component: DeckPublicEdit, canActivate: [AuthGuard] },
      { path: 'decks/edit/:uid', component: DeckPublicEdit, canActivate: [AuthGuard] },
      { path: 'decks/:uid', redirectTo: 'decks/:uid/list' },
      { path: 'decks/:uid/:mode', component: DeckPublicShow },

      // public card routes
      { path: 'cards/new', component: CardEditComponent, outlet: 'modal' },
      { path: 'cards/new/:deckuid', component: CardEditComponent, outlet: 'modal' },
      { path: 'cards/edit/:uid', component: CardEditComponent, outlet: 'modal' },

      // named router outlet
      { path: 'card/:card', component: CardInfoComponent, outlet: 'modal' }

    ], { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    // automatically registered by pwa install
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    // noSQL Database where all subscriptions are stored (to push them from the 'server')
    AngularFireModule.initializeApp(environment.firebaseConfig, 'Vokabeldojo'),
    AngularFirestoreModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule, // Only required for storage features
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    Angular2CsvModule
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
    NewCardComponent,
    ListComponent,
    DeckPublicShow,
    DeckPublicEdit,
    EditCardComponent,
    WordLearnComponent,
    DictionaryComponent,
    CalendarComponent,
    CardInfoComponent,
    OnyomiPipe,
    VerbTableComponent,
    AdjectiveTableComponent
  ],
  bootstrap: [AppComponent],
  providers: [VocabularyService, FlashcardService]
})
export class AppModule { }
