import { Component, OnInit, ViewChild, HostListener, ElementRef, HostBinding } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { environment } from 'src/environments/environment';
import { MENU_TOGGLE_ANIMATION } from '../../../core/animations/menu.animation';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [MENU_TOGGLE_ANIMATION]
})
export class MenuComponent implements OnInit {

  show = false;
  version = environment.version;
  @HostBinding('@menuToggle') menuToggle = 'inactive';
  @ViewChild('menu', { static: false }) menu: ElementRef;


  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  toggle() {
    this.show = !this.show;
    this.menuToggle = this.menuToggle == 'inactive' ? 'active' : 'inactive';
    console.log(this.menuToggle);
  }

  @HostListener('document:click', ['$event.target'])
  onClick(target: HTMLElement) {
    //console.log(target);
    //console.log(!target.contains(this.menu.nativeElement));
    if (this.show === true) {
      if (!target.contains(this.menu.nativeElement)) {
        this.show = false
      }
    }

  }
}