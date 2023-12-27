import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnyomiJapanese } from "src/app/core/entities/OnyomiJapanese";
import { ExerciseInterface } from 'src/app/core/entities/exercise-interface';

@Component({
  selector: 'app-transform',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transform.component.html',
  styleUrls: ['./transform.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransformComponent implements OnInit {

  @Output() success = new EventEmitter<boolean>();
  @Input() exercise: ExerciseInterface;

  selected: Array<OnyomiJapanese> = [];
  options: Array<OnyomiJapanese> = [];

  constructor() { }

  ngOnInit(): void {
  }

  submit() {
    if (this.stringify(this.selected) === this.stringify(this.exercise.result)) {
      this.success.emit(true);
    } else {
      this.success.emit(false);
    }
  }

  private stringify(words: OnyomiJapanese[]): string {
    return words.map(s => s.japanese).join('');
  }
}
