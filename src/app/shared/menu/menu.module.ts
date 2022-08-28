import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { FeatherModule } from 'angular-feather';
import { Shuffle, Home, Coffee, ExternalLink, User, Feather, Plus, Edit, Copy, CheckCircle, MinusCircle, MoreHorizontal, PlusCircle, Trash, X, Loader, BarChart2, HelpCircle, ChevronRight, Grid, ChevronLeft, Mail, LogIn, LogOut, Save, Repeat, Book } from 'angular-feather/icons';


@NgModule({
  declarations: [MenuComponent],
  exports: [MenuComponent],
  imports: [
    CommonModule,
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
  ]
})
export class MenuModule { }
