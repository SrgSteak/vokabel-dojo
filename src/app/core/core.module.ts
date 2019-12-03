import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontSwitcherComponent } from './components/font-switcher/font-switcher.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FontSwitcherComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    FontSwitcherComponent
  ]
})
export class CoreModule { }
