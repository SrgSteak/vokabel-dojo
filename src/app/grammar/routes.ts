import { Route } from "@angular/router";
import { AuthGuard } from "../core/auth.guard";

export const ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('../grammar/list/list.component').then(c => c.ListComponent),
    title: 'Vokabeldojo | Grammatikpunkte'
  },
  {
    path: ':slug',
    loadComponent: () => import('../grammar/grammar-quick-sheet/grammar-quick-sheet.component').then(c => c.GrammarQuickSheetComponent)
  },
  {
    path: ':slug/:section',
    loadComponent: () => import('../grammar/exercise/exercise.component').then(c => c.ExerciseComponent)
  },
  {
    path: 'new',
    outlet: 'modal',
    canActivate: [AuthGuard],
    loadComponent: () => import('./new/edit-grammar.component').then(c => c.EditGrammarComponent)
  }
]