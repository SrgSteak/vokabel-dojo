import { animate, state, style, transition, trigger, group, animation, useAnimation, stagger, query } from '@angular/animations';

export const easeInOutCubic = 'cubic-bezier(0.645, 0.045, 0.355, 1.000)';
export const woshIn = animation([
  style({
    transform: '{{ to }}', //'translateY(100%)',
    opacity: 0
  }),
  group([
    animate('{{ timecurve }}', style({
      transform: '{{ from }}', //'translateY(0%)',
    })),
    animate('{{ timecurve }}', style({
      opacity: 1
    }))
  ])
], { params: { from: 'translateY(0%)', to: 'translateY(100%)', timecurve: `400ms ${easeInOutCubic}` } });

export const woshOut = animation([
  style({
    transform: '{{ from }}', //'translateY(0%)',
    opacity: 1
  }),
  group([
    animate('{{ timecurve }}', style({
      transform: '{{ to }}', //'translateY(100%)'
    })),
    animate('{{ timecurveOpacity }}', style({
      opacity: 0
    }))
  ])
], { params: { from: 'translateY(0%)', to: 'translateY(100%)', timecurve: `400ms ${easeInOutCubic}`, timecurveOpacity: `350ms ${easeInOutCubic}` } })

export const regularState = state('in', style({
  transform: '{{ from }}', //'translateY(0%)',
  opacity: 1
}), { params: { from: 'translateY(0%)' } });

export const fadeIn = animation([
  style({
    opacity: 0
  }),
  animate('{{ timecurve }}', style({
    opacity: 1
  }))
], { params: { timecurve: '100ms' } })

export const fadeOut = animation([
  style({
    opacity: 1
  }),
  animate('{{ timecurve }}', style({
    opacity: 0
  }))
], { params: { timecurve: '100ms' } })

export const FADE_IN_OUT_ANIMATION =
  trigger('fadeInOutTrigger', [
    transition(':enter', [
      useAnimation(fadeIn)
    ]),
    transition(':leave', [
      useAnimation(fadeOut)
    ])
  ])

export const FLY_IN_OUT_ANIMATION =
  trigger('flyInOutTrigger', [
    regularState,
    transition(':enter', [
      useAnimation(woshIn)
    ]),
    transition(':leave', [
      useAnimation(woshOut)
    ])
  ]);

export const ROLL_IN_OUT_ANIMATION =
  trigger('rollInOutAnimation', [
    transition(':enter', [
      style({ height: 0, overflow: 'hidden' }),
      animate(`250ms ${easeInOutCubic}`, style({ height: '*', overflow: 'show' })),
    ]),
    transition(':leave', [
      animate(`250ms ${easeInOutCubic}`, style({ height: '0px', padding: '0px', margin: '0px' })),
    ])
  ]);