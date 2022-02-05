import { Component, OnInit } from '@angular/core';
import { BUBBLE_ROLL_ANIMATION } from '../animations/modal.animation';
import { SelectService } from '../services/select.service';

@Component({
  selector: 'app-selectbubble',
  templateUrl: './selectbubble.component.html',
  styleUrls: ['./selectbubble.component.scss'],
  animations: [BUBBLE_ROLL_ANIMATION]
})
export class SelectbubbleComponent implements OnInit {

  constructor(public selectService: SelectService) { }

  ngOnInit(): void {
  }

}
