import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  show = false;

  @ViewChild('menu') menu: ElementRef;

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  toggle() {
    this.show = !this.show;
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