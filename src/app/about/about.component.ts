import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  //encapsulation: ViewEncapsulation.None,
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
