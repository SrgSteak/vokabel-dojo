import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LearnComponent } from './learn/learn.component';
import { QuizComponent } from './quiz/quiz.component';
import { MenuComponent } from './menu/menu.component';
import { VocabularyService } from './vocabulary.service';
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
import { WelcomeComponent } from './welcome/welcome.component';
import { NumbersComponent } from './numbers/numbers.component';
import { NumberPipe } from './shared/pipes/number.pipe';
import { CoreModule } from './core/core.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditComponent as DeckPublicEdit } from './decks/edit/edit.component';
import { ListComponent as CardListComponent } from './cards/list/list.component';
import { EditComponent as CardEditComponent } from './cards/edit/edit.component';
import { ShowComponent as DeckPublicShow } from './decks/show/show.component';
import { ListComponent } from './decks/list/list.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { Angular2CsvModule } from 'angular2-csv';
import { CalendarComponent } from './time/calendar/calendar.component';
import { CardInfoComponent } from './shared/card-info/card-info.component';
import { OnyomiPipe } from './shared/pipes/onyomi.pipe';
import { VerbTableComponent } from './shared/card-info/verb-table/verb-table.component';
import { AdjectiveTableComponent } from './shared/card-info/adjective-table/adjective-table.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { DecknamePipe } from './pipes/deckname.pipe';
import { MagicLinkComponent } from './user-profile/magic-link/magic-link.component';

@NgModule({
  imports: [
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
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
    AboutComponent,
    NotificationcenterComponent,
    OverviewComponent,
    WelcomeComponent,
    NumbersComponent,
    NumberPipe,
    UserProfileComponent,
    CardListComponent,
    CardEditComponent,
    ListComponent,
    DeckPublicShow,
    DeckPublicEdit,
    DictionaryComponent,
    CalendarComponent,
    CardInfoComponent,
    OnyomiPipe,
    VerbTableComponent,
    AdjectiveTableComponent,
    DecknamePipe,
    MagicLinkComponent
  ],
  bootstrap: [AppComponent],
  providers: [VocabularyService, FlashcardService]
})
export class AppModule { }
