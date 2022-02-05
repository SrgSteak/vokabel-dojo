import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { RouterModule } from '@angular/router';
import { CheckCircle, MinusCircle, X } from 'angular-feather/icons';
import { FeatherModule } from 'angular-feather';

@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    CommonModule,
    FeatherModule.pick({
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
