import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontSwitcherComponent } from './components/font-switcher/font-switcher.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectionComponent } from './components/selection/selection.component';
import { FeatherModule } from 'angular-feather';
import { Shuffle, Home, Coffee, ExternalLink, User, Feather, Plus, Edit, Copy, CheckCircle, MinusCircle, MoreHorizontal, PlusCircle, Trash, X, Loader, BarChart2, HelpCircle } from 'angular-feather/icons';
import { WordListComponent } from '../words/word-list/word-list.component';
import { SelectionPageComponent } from './components/selection-page/selection-page.component';
import { WordQuizComponent } from '../words/word-quiz/word-quiz.component';
import { ModalComponent } from '../shared/modal/modal.component';
import { WordGridComponent } from '../words/word-grid/word-grid.component';
import { WordLearnComponent } from '../words/word-learn/word-learn.component';
import { RouterModule } from '@angular/router';
import { DecknamePipe } from '../pipes/deckname.pipe';

@NgModule({
  declarations: [
    WordLearnComponent,
    WordGridComponent,
    WordQuizComponent,
    FontSwitcherComponent,
    SelectionComponent,
    WordListComponent,
    SelectionPageComponent,
    ModalComponent,
    DecknamePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    FeatherModule.pick({
      CheckCircle,
      MinusCircle,
      MoreHorizontal,
      PlusCircle,
      Trash,
      X,
      Copy,
      Edit,
      Plus,
      Loader,
      BarChart2,
      HelpCircle,
      Feather,
      User,
      ExternalLink,
      Coffee,
      Home,
      Shuffle
    })
  ],
  providers: [],
  exports: [
    DecknamePipe,
    WordLearnComponent,
    WordGridComponent,
    ModalComponent,
    WordQuizComponent,
    FontSwitcherComponent,
    FeatherModule,
    WordListComponent
  ]
})
export class CoreModule { }
