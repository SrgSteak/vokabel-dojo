import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { RouterModule } from '@angular/router';
import { CheckCircle, ChevronLeft, MinusCircle, X } from 'angular-feather/icons';
import { FeatherModule } from 'angular-feather';
import { MenuModule } from '../shared/menu/menu.module';

@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    CommonModule,
    MenuModule,
    FeatherModule.pick({
      ChevronLeft,
      MinusCircle,
      CheckCircle,
      X
    }),
    RouterModule.forChild([
      {
        path: '',
        component: AboutComponent
      }
    ])
  ]
})
export class AboutModule { }
