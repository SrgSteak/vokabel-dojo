import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { CheckCircle, Edit, X } from 'angular-feather/icons';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // icons on the top left to select, open edit mode and close the modal
    FeatherModule.pick({CheckCircle, Edit, X})
  ],
  exports: [FeatherModule]
})
export class IconsModule { }
