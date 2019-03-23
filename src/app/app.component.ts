import { Component, OnInit } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { SubscriptionService } from './services/subscription.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit{

  // Thats the VAPID (Voluntary Application Server Identification) key generated on the terminal with we-push generate-vapid-keys --json
  readonly VAPID_PUBLIC_KEY = "BEf3AAasjVowk2heZKL_QLSM9AkUrEiiCaxdZNrA96Ffe3lPs66r7mguXTUAvzdmvBT44dcA-JjdTyzBXdUUKfM";
  constructor(private swUpdate: SwUpdate, private swPush: SwPush, private subscriptionService: SubscriptionService) {}

  ngOnInit() {
    // service that notifies you if a new version is available.
    // displays a confirmation window and reloads browser to "load update"
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New Version available. Load now?')) {
          window.location.reload();
        }
      });

      this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      })
      .then(sub => {
        console.log(sub);
        // this.subscriptionService.addSubscription(sub);
      })
      .catch(err => console.error("Could not subscribe to notifications", err));
    }
  }
}
