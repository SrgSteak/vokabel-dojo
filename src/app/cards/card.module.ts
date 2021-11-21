import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { AuthGuard } from '../core/auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { Trash } from 'angular-feather/icons';



@NgModule({
  declarations: [
    ListComponent,
    EditComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FeatherModule.pick({
      Trash
    }),
    RouterModule.forChild([
      { path: 'user', component: ListComponent, data: { showUserCards: true }, canActivate: [AuthGuard] },
      { path: 'new', component: EditComponent, outlet: 'modal' },
      { path: 'new/:deckuid', component: EditComponent, outlet: 'modal' },
      { path: 'edit/:uid', component: EditComponent, outlet: 'modal', canActivate: [AuthGuard] }
    ])
  ]
})
export class CardModule { }
