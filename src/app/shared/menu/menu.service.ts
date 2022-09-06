import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  readonly menuEmitter = new EventEmitter<string>();
  selectedMenu = '';
  constructor() { }

  toggleMenu(menu = 'main', open = true) {
    this.menuEmitter.emit(menu);
    this.selectedMenu = menu;
  }
}
