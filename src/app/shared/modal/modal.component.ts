import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, AfterViewInit {

  @ViewChild('content', { static: true }) content: ElementRef;
  @ViewChild('teaser', { static: true }) teaser: ElementRef;

  open = false;

  constructor() {
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.content.nativeElement.style.top = '-' + this.content.nativeElement.getBoundingClientRect().height + 'px';
  }

  toggle() {
    this.open = !this.open;
    this.teaser.nativeElement.classList.remove('noanimate');
    this.content.nativeElement.classList.remove('noanimate');
    if (this.open) {
      this.content.nativeElement.style.top = '0';
      this.teaser.nativeElement.style.top = this.content.nativeElement.getBoundingClientRect().height + 'px';
    } else {
      this.teaser.nativeElement.style.top = '0';
      this.content.nativeElement.style.top = '-' + this.content.nativeElement.getBoundingClientRect().height + 'px';
    }
    setTimeout(() => {
      this.teaser.nativeElement.classList.add('noanimate');
      this.content.nativeElement.classList.add('noanimate');
    }, 300);
  }

  positionModal() {
    setTimeout(() => {

      if (this.open) {
        this.teaser.nativeElement.style.top = this.content.nativeElement.getBoundingClientRect().height + 'px';
      } else {
        this.content.nativeElement.style.top = '-' + this.content.nativeElement.getBoundingClientRect().height + 'px';
      }
    }, 1);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.positionModal();
  }
}
