import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from '../welcome/welcome.component';
import { DictionaryComponent } from '../dictionary/dictionary.component';
import { WordQuizComponent } from '../words/word-quiz/word-quiz.component';
import { WordGridComponent } from '../words/word-grid/word-grid.component';
import { WordListComponent } from '../words/word-list/word-list.component';
import { NumbersComponent } from '../numbers/numbers.component';
import { AuthGuard } from '../core/auth.guard';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { SelectionComponent } from '../core/components/selection/selection.component';
import { CardInfoComponent } from '../shared/card-info/card-info.component';
import { SelectionPageComponent } from '../core/components/selection-page/selection-page.component';
import { MagicLinkComponent } from '../user-profile/magic-link/magic-link.component';
import { EditComponent as CardEditComponent } from '../cards/edit/edit.component';

export const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'dictionary', component: DictionaryComponent, outlet: 'modal' },
  { path: 'word-quiz', redirectTo: 'word-quiz/hiragana' },
  { path: 'word-quiz/:type', component: WordQuizComponent },
  { path: 'word-grid/:type', component: WordGridComponent },
  { path: 'word-list', component: WordListComponent },
  { path: 'numbers', component: NumbersComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserProfileComponent },
  { path: 'user/magic-link', component: MagicLinkComponent, outlet: 'modal' },
  { path: 'user/finish-magic-link', component: MagicLinkComponent, data: { finishMagicLink: true } },
  { path: 'selection', component: SelectionComponent, outlet: 'modal' },
  {
    path: 'home',
    loadChildren: () => import('../welcome/welcome.module').then(m => m.WelcomeModule)
  },
  {
    path: 'syllables',
    loadChildren: () => import('../syllables/syllables.module').then(m => m.SyllablesModule)
  },
  {
    path: 'about',
    loadChildren: () => import('../about/about.module').then(m => m.AboutModule)
  },
  {
    path: 'decks',
    loadChildren: () => import('../decks/deck.module').then(m => m.DeckModule)
  },
  {
    path: 'cards',
    loadChildren: () => import('../cards/card.module').then(m => m.CardModule)
  },
  {
    path: 'jouyou-kanji',
    loadChildren: () => import('../jouyou-kanji/jouyou-kanji.module').then(m => m.JouyouKanjiModule)
  },
  // selection routes
  { path: 'selection/:mode', component: SelectionPageComponent },
  // global named router outlets
  { path: 'cards/new/:deckuid', component: CardEditComponent, outlet: 'modal', canActivate: [AuthGuard] },
  { path: 'cards/edit/:uid', component: CardEditComponent, outlet: 'modal', canActivate: [AuthGuard] },
  { path: 'cards/:card', component: CardInfoComponent, outlet: 'modal' },
  {
    path: 'cards/new/:deckuid',
    outlet: 'modal',
    component: CardEditComponent,
  }
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
