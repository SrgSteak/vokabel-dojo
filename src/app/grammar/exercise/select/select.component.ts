import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseInterface } from 'src/app/core/entities/exercise-interface';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements OnInit {

  @Output() success = new EventEmitter<boolean>();
  @Input() exercise: ExerciseInterface;

  constructor() { }

  ngOnInit(): void {
  }

}
