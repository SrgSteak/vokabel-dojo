import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanjiListComponent } from './kanji-list/kanji-list.component';
import { KanjiModule } from '../shared/kanji/kanji.module';
import { RouterModule } from '@angular/router';
import { KanjiPartsComponent } from './kanji-parts/kanji-parts.component';
import { FeatherModule } from 'angular-feather';
import { ChevronLeft, Eye, EyeOff, Move, Trash, X } from 'angular-feather/icons';
import { MenuModule } from '../shared/menu/menu.module';



@NgModule({
  declarations: [
    KanjiListComponent,
    KanjiPartsComponent
  ],
  imports: [
    CommonModule,
    MenuModule,
    KanjiModule,
    FeatherModule.pick({
      ChevronLeft,
      Trash,
      Move,
      X,
      Eye,
      EyeOff
    }),
    RouterModule.forChild([
      { path: '', component: KanjiListComponent},
      // { path: ':number', component: KanjiListComponent}
    ])
  ]
})
export class JouyouKanjiModule { }
