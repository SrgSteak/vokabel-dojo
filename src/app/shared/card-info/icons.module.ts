import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { CheckCircle, X } from 'angular-feather/icons';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FeatherModule.pick({ X, CheckCircle })
  ],
  exports: [FeatherModule]
})
export class IconsModule { }
