import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from '../welcome/welcome.component';
import { QuizComponent } from '../quiz/quiz.component';
import { LearnComponent } from '../learn/learn.component';
import { DictionaryComponent } from '../dictionary/dictionary.component';
import { OverviewComponent } from '../syllables/overview/overview.component';
import { WordQuizComponent } from '../words/word-quiz/word-quiz.component';
import { WordGridComponent } from '../words/word-grid/word-grid.component';
import { WordListComponent } from '../words/word-list/word-list.component';
import { AboutComponent } from '../about/about.component';
import { NumbersComponent } from '../numbers/numbers.component';
import { AuthGuard } from '../core/auth.guard';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { SelectionComponent } from '../core/components/selection/selection.component';
import { CardInfoComponent } from '../shared/card-info/card-info.component';
import { EditComponent as DeckPublicEdit } from '../decks/edit/edit.component';
import { EditComponent as CardEditComponent } from '../cards/edit/edit.component';
import { ShowComponent as DeckPublicShow } from '../decks/show/show.component';
import { ListComponent } from '../decks/list/list.component';

export const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', pathMatch: 'full', component: WelcomeComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'learn', component: LearnComponent },
  { path: 'dictionary', component: DictionaryComponent, outlet: 'modal' },
  { path: 'syllables/overview', component: OverviewComponent },
  { path: 'word-quiz', redirectTo: 'word-quiz/hiragana' },
  { path: 'word-quiz/:type', component: WordQuizComponent },
  { path: 'word-grid/:type', component: WordGridComponent },
  { path: 'word-list', component: WordListComponent },
  { path: 'about', component: AboutComponent },
  { path: 'numbers', component: NumbersComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserProfileComponent },
  { path: 'selection', component: SelectionComponent, outlet: 'modal' },

  // public deck routes
  { path: 'decks', component: ListComponent },
  { path: 'decks/user', component: ListComponent, data: { showUserDecks: true } },
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

]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(ROUTES, {
      useHash: false,
      scrollPositionRestoration: 'disabled',
      anchorScrolling: 'enabled',
      // enableTracing: true // for route event debugging
      // initialNavigation: 'enabled'
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
