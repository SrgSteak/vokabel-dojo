import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { CheckCircle, Edit, Save, Trash, X, MinusCircle, Repeat } from 'angular-feather/icons';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // icons on the top left to select, open edit mode and close the modal
    FeatherModule.pick({
      // show card
      CheckCircle,
      Edit,
      X,
      // edit card
      Trash,
      Save,
      MinusCircle,
      Repeat
    })
  ],
  exports: [FeatherModule]
})
export class IconsModule { }
