import { Component, OnInit, ViewChild, HostListener, ElementRef, HostBinding, OnDestroy } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { environment } from 'src/environments/environment';
import { MENU_TOGGLE_ANIMATION } from '../../../core/animations/menu.animation';
import { MenuService } from '../menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [MENU_TOGGLE_ANIMATION]
})
export class MenuComponent implements OnInit, OnDestroy {

  show = false;
  version = environment.version;
  @HostBinding('@menuToggle') menuToggle = 'inactive';
  @ViewChild('menu', { static: false }) menu: ElementRef;
  @ViewChild('menuButtons', { static: false }) menuButtons: ElementRef;
  private menuSub: Subscription;

  constructor(public auth: AuthService, protected menuService: MenuService) { }

  ngOnInit() {
    this.menuSub = this.menuService.menuEmitter.subscribe(menu => {
      if (this.menuService.selectedMenu === menu || this.menuToggle === 'inactive') {
        this.menuToggle = this.menuToggle === 'active' ? 'inactive' : 'active';
      }
    })
  }

  ngOnDestroy(): void {
    this.menuSub?.unsubscribe();
  }

  toggle() {
    this.show = !this.show;
    this.menuToggle = this.menuToggle == 'inactive' ? 'active' : 'inactive';
  }

  @HostListener('document:click', ['$event.target'])
  onClick(target: HTMLElement) {
    if (this.menuToggle === 'active') {
      if (!this.menu.nativeElement.contains(target) && !this.menuButtons.nativeElement.contains(target)) {
        this.menuService.toggleMenu(this.menuService.selectedMenu);
      }
    }

  }
}