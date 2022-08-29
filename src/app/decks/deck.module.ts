import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { ShowComponent } from './show/show.component';
import { AuthGuard } from 'src/app/core/auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { SharedLearnmodeModule } from '../shared/shared-learnmode/shared-learnmode.module';
import { ModeSelectComponent } from './components/mode-select/mode-select.component';
import { MenuModule } from '../shared/menu/menu.module';

@NgModule({
  declarations: [
    ListComponent,
    EditComponent,
    ShowComponent,
    ModeSelectComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    MenuModule,
    ReactiveFormsModule,
    SharedLearnmodeModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: ListComponent
      },
      {
        path: 'user',
        component: ListComponent,
        data: { showUserDecks: true },
        canActivate: [AuthGuard]
      },
      {
        path: 'new',
        outlet: 'modal',
        component: EditComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'edit/:uid',
        outlet: 'modal',
        component: EditComponent,
        canActivate: [AuthGuard]
      },
      {
        path: ':uid/mode-select',
        outlet: 'modal',
        component: ModeSelectComponent
      },
      {
        path: ':uid',
        pathMatch: 'full',
        redirectTo: ':uid/list'
      },
      {
        path: ':uid/:mode',
        component: ShowComponent
      }
    ])
  ]
})
export class DeckModule { }
