import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from '../shared/menu/menu.module';
import { RouterModule } from '@angular/router';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { MagicLinkComponent } from '../user-profile/magic-link/magic-link.component';
import { FeatherModule } from 'angular-feather';
import { Save, X } from 'angular-feather/icons';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UserProfileComponent,
    MagicLinkComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MenuModule,
    FeatherModule.pick({
      Save,
      X
    }),
    RouterModule.forChild([
      {
        path: '',
        // pathMatch: 'full',
        component: UserProfileComponent
      },
      {
        path: 'magic-link',
        component: MagicLinkComponent,
        outlet: 'modal'
      },
      {
        path: 'finish-magic-link',
        component: MagicLinkComponent,
        data: { finishMagicLink: true }
      },
    ])
  ]
})
export class UserModule { }
