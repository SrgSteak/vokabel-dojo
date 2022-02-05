import { Injectable, EventEmitter } from '@angular/core';
import { AuthService, User } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class FontSwitcherService {

  readonly onChange: EventEmitter<string> = new EventEmitter<string>();
  private _currentStyle = 'serif';

  get currentStyle() {
    return this._currentStyle;
  }

  constructor() {
    this.loadSetting();
  }

  updateFontStyle(style: string, noNotification: boolean) {
    window.localStorage.setItem('userSettings', JSON.stringify({ style: style }));
    this._currentStyle = style;
    if (!noNotification) {
      this.onChange.emit(style);
    }
  }

  private loadSetting() {
    try {
      const data = window.localStorage.getItem('userSettings');
      if (data) {
        this._currentStyle = JSON.parse(data).style;
      }
    } catch (error) {
      console.error(error);
      this._currentStyle = 'serif';
    }
  }
}
