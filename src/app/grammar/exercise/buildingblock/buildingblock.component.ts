import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { OnyomiPipe } from 'src/app/shared/pipes/onyomi.pipe';
import { NgFlipAnimationDirective } from 'src/app/directives/ng-flip-animation.directive';
import { OriginService } from 'src/app/directives/origin.service';
import { ExerciseType } from "src/app/core/entities/ExerciseType";
import { OnyomiJapanese } from "src/app/core/entities/OnyomiJapanese";
import { ExerciseInterface } from 'src/app/core/entities/exercise-interface';

export function shuffle<T>(deck: Array<T>): Array<T> {
  let currentIndex = deck.length, temporaryValue: T, randomIndex: number;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = deck[currentIndex];
    deck[currentIndex] = deck[randomIndex];
    deck[randomIndex] = temporaryValue;
  }
  return deck;
}

@Component({
  selector: 'app-buildingblock',
  standalone: true,
  imports: [CommonModule, OnyomiPipe, NgFlipAnimationDirective],
  templateUrl: './buildingblock.component.html',
  styleUrls: ['./buildingblock.component.scss'],
  animations: [
    trigger('deselect', [
      transition(':leave', [
          style({ opacity: 0 }),
          animate('100ms ease-in-out', style({ width: 0, margin: '-8px' }))
      ])
    ]),
    trigger('placeholder', [
      // style({overflow: 'hidden'}),
      transition(':enter', [
        style({'min-width': 0, 'padding-left': 0, 'padding-right': 0, width: 0}),
        animate('100ms ease-in-out', style({ 'min-width': '*', 'padding-left': '*', 'padding-right': '*', width: '*'}))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildingblockComponent implements OnInit, OnChanges {

  @Output() success = new EventEmitter<boolean>();
  @Input() exercise: ExerciseInterface;

  selectedItems = [];
  options = [];
  draggedWord: number;
  draggedOver: number;
  ExerciseType = ExerciseType;

  constructor(public originService: OriginService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exercise'].previousValue !== changes['exercise'].currentValue && changes['exercise'].currentValue) {
      this.selectedItems = [];
      this.options = this.prepareOptions(changes['exercise'].currentValue);
    }
  }

  private prepareOptions(exercise: ExerciseInterface) {
    if ([ExerciseType.buildingblock, ExerciseType.select].includes(exercise.type)) {
      return shuffle([...exercise.given, ...exercise.result]);
    }
    let res: Array<OnyomiJapanese> = [];
    exercise.result.forEach(result => {
      if (result.reading.length) {
        const rts = result.reading.split('*');
        result.japanese.split('').forEach((val: string, index: number) => {
          res.push({ japanese: val, reading: rts[index]});
        });
      } else {
        res.concat(result.japanese.split('').map(c => { return {japanese: c, reading: ''}}));
      }
    })

    return shuffle([...exercise.given, ...res])
  }

  addToSelection(event: MouseEvent, word: OnyomiJapanese) {
    this.originService.origin = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.selectedItems.push(word);
  }

  removeFromSelection(event: MouseEvent, index: number) {
    this.originService.origin = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.selectedItems.splice(index, 1);
  }

  submit() {
    if (this.selectedItems.length) {
      this.success.emit(this.validateSelection());
    }
  }

  isArray(thing: any): boolean {
    return Array.isArray(thing);
  }

  isString(thing: any): boolean {
    return typeof thing === 'string';
  }

  getPreFillInstruction(): Array<OnyomiJapanese> {
    if(this.isArray(this.exercise.instruction)) {
      return (this.exercise.instruction as Array<OnyomiJapanese>).slice(0, (this.exercise.instruction as Array<OnyomiJapanese>).findIndex(p => p === null))
    }
    return [];
  }

  getPostFillInstruction(): Array<OnyomiJapanese> {
    if(this.isArray(this.exercise.instruction)) {
      return (this.exercise.instruction as Array<OnyomiJapanese>).slice((this.exercise.instruction as Array<OnyomiJapanese>).findIndex(p => p === null) + 1);
    }
    return [];
  }

  private validateSelection(): boolean {
    return this.selectedItems.map(s => s.japanese).join('') === this.exercise.result.map(r => r.japanese).join('');
  }

  dragStart(event: DragEvent, i: number) {
    this.draggedWord = i;
    return true;
  }

  dragEnter(event: DragEvent, i: number) {
    this.draggedOver = i;
  }

  dragLeave(event: DragEvent) {
    this.draggedOver = null;
  }

  dragEnd() {
    this.draggedOver = null;
    this.draggedWord = null;
  }

  drop(i: number) {
    this.selectedItems[this.draggedWord] = this.selectedItems.splice(this.draggedOver, 1, this.selectedItems[this.draggedWord])[0]
  }

  /**
   * I'm here to allow custom behavior
   * @param event
   */
    dragOver(event: DragEvent) {
      event.preventDefault();
    }
}
