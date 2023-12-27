import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrammarService } from 'src/app/core/grammar.service';
import { IconsModule } from 'src/app/shared/card-info/icons.module';
import { RouterModule } from '@angular/router';
import { AuthService, User } from 'src/app/core/auth.service';
import { Subscription } from 'rxjs';
import { MenuModule } from 'src/app/shared/menu/menu.module';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    IconsModule,
    RouterModule,
    MenuModule
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, OnDestroy {

  grammarList = [];
  user: User;
  authSub: Subscription;

  constructor(
    protected grammarService: GrammarService,
    protected authService: AuthService,
    protected cdr: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this.authSub = this.authService.user.subscribe(_user => {
      this.user = _user;
    })
    this.grammarService.all().subscribe(result => {
      this.grammarList = result;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

}
