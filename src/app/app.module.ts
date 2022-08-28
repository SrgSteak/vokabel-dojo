import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { VocabularyService } from './vocabulary.service';
import { FlashcardService } from './flashcard.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { connectFirestoreEmulator, enableMultiTabIndexedDbPersistence, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { connectFunctionsEmulator, FunctionsModule, getFunctions, provideFunctions } from '@angular/fire/functions';
import { NotificationcenterComponent } from './notificationcenter/notificationcenter.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NumbersComponent } from './numbers/numbers.component';
import { NumberPipe } from './shared/pipes/number.pipe';
import { CoreModule } from './core/core.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { CalendarComponent } from './time/calendar/calendar.component';
import { CardInfoComponent } from './shared/card-info/card-info.component';
import { OnyomiPipe } from './shared/pipes/onyomi.pipe';
import { VerbTableComponent } from './shared/card-info/verb-table/verb-table.component';
import { AdjectiveTableComponent } from './shared/card-info/adjective-table/adjective-table.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { MagicLinkComponent } from './user-profile/magic-link/magic-link.component';
import { FeatherModule } from 'angular-feather';
import { HelpCircle } from 'angular-feather/icons';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EditComponent as CardEditComponent } from './cards/edit/edit.component';
import { SelectbubbleComponent } from './core/selectbubble/selectbubble.component';
import { KanjiModule } from './shared/kanji/kanji.module';

let resolvePersistenceEnabled: (enabled: boolean) => void;

export const persistenceEnabled = new Promise<boolean>(resolve => {
  resolvePersistenceEnabled = resolve;
});

@NgModule({
  imports: [
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    KanjiModule,
    provideAuth(() => {
      const auth = getAuth();
      if (environment.useRelay) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      }
      return auth;
    }),
    // automatically registered by pwa install
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    // noSQL Database where all subscriptions are stored (to push them from the 'server')
    FunctionsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useRelay) {
        console.log('NOW USING RELAY FOR FIRESTORE');
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      enableMultiTabIndexedDbPersistence(firestore).then(
        () => resolvePersistenceEnabled(true),
        () => resolvePersistenceEnabled(false)
      );
      return firestore;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.useRelay) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    }),
    FeatherModule.pick({
      HelpCircle
    })
  ],
  declarations: [
    AppComponent,
    NotificationcenterComponent,
    WelcomeComponent,
    NumbersComponent,
    NumberPipe,
    UserProfileComponent,
    DictionaryComponent,
    CalendarComponent,
    CardInfoComponent,
    CardEditComponent,
    OnyomiPipe,
    VerbTableComponent,
    AdjectiveTableComponent,
    MagicLinkComponent,
    SelectbubbleComponent
  ],
  bootstrap: [AppComponent],
  providers: [VocabularyService, FlashcardService, AngularFirestore]
})
export class AppModule { }

