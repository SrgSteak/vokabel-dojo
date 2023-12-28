import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressComponent implements OnInit {

  @Input() total: number;
  @Input() current: number;

  constructor() { }

  ngOnInit(): void {
  }

}
