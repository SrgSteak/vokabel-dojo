import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontSwitcherComponent } from './components/font-switcher/font-switcher.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { Shuffle, Home, Coffee, ExternalLink, User, Feather, Plus, Edit, Copy, CheckCircle, MinusCircle, MoreHorizontal, PlusCircle, Trash, X, Loader, BarChart2, HelpCircle, ChevronRight, Grid, ChevronLeft, Mail, LogIn, LogOut, Save, Repeat, Book } from 'angular-feather/icons';
import { ModalComponent } from '../shared/modal/modal.component';
import { RouterModule } from '@angular/router';
import { MenuModule } from '../shared/menu/menu.module';

@NgModule({
  declarations: [
    FontSwitcherComponent,
    ModalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MenuModule,
    RouterModule.forChild([]),
    FeatherModule.pick({
      Book,
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
      Shuffle,
      ChevronRight,
      ChevronLeft,
      Grid,
      Mail,
      LogIn,
      LogOut,
      Save,
      Repeat
    })
  ],
  providers: [],
  exports: [
    ModalComponent,
    FontSwitcherComponent,
    FeatherModule
  ]
})
export class CoreModule { }
