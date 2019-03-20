import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit{

  constructor(private swUpdate: SwUpdate) {}

  ngOnInit() {
    // service that notifies you if a new version is available.
    // displays a confirmation window and reloads browser to "load update"
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New Version available. Load now?')) {
          window.location.reload();
        }
      })
    }
  }
}
