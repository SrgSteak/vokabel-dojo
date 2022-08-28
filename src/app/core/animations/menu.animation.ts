import { animate, state, style, transition, trigger } from "@angular/animations";
import { easeInOutCubic } from "./modal.animation";

export const MENU_TOGGLE_ANIMATION =
    trigger('menuToggle', [
        state('inactive', style({
            transform: '{{ state }}'
        }), { params: { state: 'translateX(-100%)'}}),
        state('active', style({
            transform: '{{ state }}'
        }), { params: { state: 'translateX(0)'}}),
        transition('inactive <=> active', [
            animate(`400ms ${easeInOutCubic}`)
        ])
    ]);