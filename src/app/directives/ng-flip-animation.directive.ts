import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { OriginService } from './origin.service';

@Directive({
  selector: '[appNgFlipAnimation]',
  standalone: true
})
export class NgFlipAnimationDirective implements OnInit, OnDestroy {

  @Input('appFlipOptions') options = {
    duration: 200,
    easing: 'cubic-bezier(0.26, 0.86, 0.44, 0.985)',
  };

  private state = new Map<Element, any>();

  private observer: MutationObserver;

  constructor(private host: ElementRef<HTMLElement>, private originService: OriginService) {}

  ngOnInit() {
    this.observer = new MutationObserver(this.animate);
    this.observer.observe(this.host.nativeElement, { childList: true });
  }

  get elements() {
    return Array.from((this.host.nativeElement as HTMLElement).children);
  }

  private animate = () => {
    this.elements.forEach(elem => {
      const { left, top, width, height } = elem.getBoundingClientRect();

      if (!this.state.has(elem)) { // new element, get source of position where you want it to come from
        if (this.originService.origin) {
          const { left, top, width, height } = this.originService.origin;
          this.state.set(elem, { left, top, width, height });
        } else {
          this.state.set(elem, { left, top, width, height });
          return;
        }
      } else {
        // console.log('have it already', elem);
        return;
      }
      const cache = this.state.get(elem);

      const deltaX = cache.left - left;
      const deltaY = cache.top - top;
      const deltaW = cache.width / width;
      const deltaH = cache.height / height;

      this.state.set(elem, { left, top, width, height });

      const { duration, easing } = this.options;

      elem.animate(
        [
          {
            transformOrigin: 'top left',
            transform: `
              translate(${deltaX}px, ${deltaY}px)
              scale(${deltaW}, ${deltaH})
            `,
            opacity: cache.opacity,
          },
          {
            transformOrigin: 'top left',
            transform: 'none',
          },
        ],
        {
          duration,
          easing,
        }
      );
    });
  };

  ngOnDestroy() {
    this.observer.disconnect();
  }
}
