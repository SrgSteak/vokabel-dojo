import { NgFlipAnimationDirective } from './ng-flip-animation.directive';
import { OriginService } from './origin.service';

describe('NgFlipAnimationDirective', () => {
  it('should create an instance', () => {
    const elementRef = jasmine.createSpyObj('ElementRef', [], ['nativeElement']);
    const originService = new OriginService();
    const directive = new NgFlipAnimationDirective(elementRef, originService);
    expect(directive).toBeTruthy();
  });
});
