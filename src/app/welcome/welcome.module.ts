import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome.component';
import { MenuModule } from '../shared/menu/menu.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    WelcomeComponent
  ],
  imports: [
    CommonModule,
    MenuModule,
    RouterModule.forChild([
      {
        path: '',
        component: WelcomeComponent
      }
    ])
  ]
})
export class WelcomeModule { }
