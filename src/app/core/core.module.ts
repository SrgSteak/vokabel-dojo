import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontSwitcherComponent } from './components/font-switcher/font-switcher.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectionComponent } from './components/selection/selection.component';
import { AppRoutingModule } from '../app-routing/app-routing.module';
import { FeatherModule } from 'angular-feather';
import { CheckCircle, MinusCircle } from 'angular-feather/icons';
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
      MinusCircle
    })
  ],
  exports: [
    FontSwitcherComponent,
    FeatherModule,
    WordListComponent
  ]
})
export class CoreModule { }
