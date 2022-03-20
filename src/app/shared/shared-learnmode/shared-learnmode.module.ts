import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooseModeComponent } from './choose-mode/choose-mode.component';

@NgModule({
  declarations: [
    ChooseModeComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ChooseModeComponent,
  ]
})
export class SharedLearnmodeModule { }
