import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private db: AngularFirestore) { }

  getSubscriptions() {
    this.db.collection('subscriptions').get().subscribe(asdf => {
      asdf.forEach(sub => {console.log(sub)});
    });
  }

  addSubscription(sub: PushSubscription) {
    // const ref = this.db.collection('subscriptions', ref => ref.where(sub.toJSON().keys.p256dh, '==', 'keys.p256dh'));

    this.db.collection('subscriptions').add(sub.toJSON());
    this.getSubscriptions();

  }
}
