import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DictionaryComponent } from '../dictionary/dictionary.component';
import { AuthGuard } from '../core/auth.guard';
import { CardInfoComponent } from '../shared/card-info/card-info.component';
import { EditComponent as CardEditComponent } from '../cards/edit/edit.component';

export const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'word-quiz', redirectTo: 'word-quiz/hiragana' },
  {
    path: 'user',
    loadChildren: () => import('../user/user.module').then(m => m.UserModule)
  },
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
    path: 'learn',
    loadChildren: () => import('../learn/learn.module').then(m => m.LearnModule)
  },
  {
    path: 'cards',
    loadChildren: () => import('../cards/card.module').then(m => m.CardModule)
  },
  {
    path: 'jouyou-kanji',
    loadChildren: () => import('../jouyou-kanji/jouyou-kanji.module').then(m => m.JouyouKanjiModule)
  },
  // global named router outlets
  { path: 'cards/new/:deckuid', component: CardEditComponent, outlet: 'modal', canActivate: [AuthGuard] },
  { path: 'cards/edit/:uid', component: CardEditComponent, outlet: 'modal', canActivate: [AuthGuard] },
  { path: 'cards/:card', component: CardInfoComponent, outlet: 'modal' },
  { path: 'cards/new/:deckuid', component: CardEditComponent, outlet: 'modal' },
  { path: 'dictionary', component: DictionaryComponent, outlet: 'modal' },
  { path: 'selection', loadComponent: () => import('../core/components/selection/selection.component').then(c => c.SelectionComponent), outlet: 'modal' },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(ROUTES, {
      useHash: false,
      scrollPositionRestoration: 'disabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
