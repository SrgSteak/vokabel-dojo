import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanjiComponent } from './kanji/kanji.component';
import { HttpClientModule } from '@angular/common/http';
import { FeatherModule } from 'angular-feather';
import { RotateCcw } from 'angular-feather/icons';
import { KanjiPartComponent } from './kanji-part/kanji-part.component';



@NgModule({
  declarations: [KanjiComponent, KanjiPartComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FeatherModule.pick({
      RotateCcw
    })
  ],
  exports: [KanjiComponent, KanjiPartComponent]
})
export class KanjiModule { }
