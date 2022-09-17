import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome.component';
import { MenuModule } from '../shared/menu/menu.module';
import { RouterModule } from '@angular/router';
import { FeatherModule } from 'angular-feather';
import {
  Shuffle,
  Home,
  Coffee,
  ExternalLink,
  User,
  Feather,
  Plus,
  Edit,
  Copy,
  CheckCircle,
  MinusCircle,
  MoreHorizontal,
  PlusCircle,
  Trash,
  X,
  Loader,
  BarChart2,
  HelpCircle,
  ChevronRight,
  Grid,
  ChevronLeft,
  Mail,
  LogIn,
  LogOut,
  Save,
  Repeat,
  Book
} from 'angular-feather/icons';
import { ListItemComponent } from '../decks/components/list-item/list-item.component';

@NgModule({
  declarations: [
    WelcomeComponent
  ],
  imports: [
    ListItemComponent,
    CommonModule,
    MenuModule,
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
    }),
    RouterModule.forChild([
      {
        path: '',
        component: WelcomeComponent
      }
    ])
  ]
})
export class WelcomeModule { }
