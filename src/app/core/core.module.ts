import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontSwitcherComponent } from './components/font-switcher/font-switcher.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectionComponent } from './components/selection/selection.component';
import { AppRoutingModule } from '../app-routing/app-routing.module';
import { FeatherModule } from 'angular-feather';
import { Plus, Edit, Copy, CheckCircle, MinusCircle, MoreHorizontal, PlusCircle, Trash, X } from 'angular-feather/icons';
import { WordListComponent } from '../words/word-list/word-list.component';


@NgModule({
  declarations: [
    FontSwitcherComponent,
    SelectionComponent,
    WordListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FeatherModule.pick({
      CheckCircle,
      MinusCircle,
      MoreHorizontal,
      PlusCircle,
      Trash,
      X,
      Copy,
      Edit,
      Plus
    })
  ],
  exports: [
    FontSwitcherComponent,
    FeatherModule,
    WordListComponent
  ]
})
export class CoreModule { }
