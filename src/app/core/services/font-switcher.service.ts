import { Injectable, EventEmitter } from '@angular/core';
import { AuthService, User } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class FontSwitcherService {

  readonly onChange: EventEmitter<string> = new EventEmitter<string>();
  private _currentStyle = 'serif';
  private user: User;

  get currentStyle() {
    return this._currentStyle;
  }

  constructor(private authService: AuthService) {
    this.authService.user.subscribe(user => {
      this.user = user;
      try {
        this._currentStyle = this.user.settings.fontStyle
      } catch (error) {
        console.log('user has no style B)');
      }
    });
  }

  updateFontStyle(style: string, noNotification: boolean) {
    this.updateUserSettings(style);
    this._currentStyle = style;
    if (!noNotification) {
      this.onChange.emit(style);
    }
  }

  private updateUserSettings(style: string) {
    if (this.user.settings) {
      this.user.settings.fontStyle = style;
    } else {
      this.user.settings = { fontStyle: style };
    }
    this.authService.updateUserData(this.user);
  }
}
