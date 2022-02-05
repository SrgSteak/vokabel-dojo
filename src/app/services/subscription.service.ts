import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore } from '@angular/fire/firestore';
import { docData } from 'rxfire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private db: Firestore) { }

  getSubscriptions() {
    const ref = doc(this.db, 'subscriptions')
    docData(ref).pipe().subscribe(asdf => {
      asdf.forEach(sub => { console.log(sub) });
    });
  }

  addSubscription(sub: PushSubscription) {
    const ref = collection(this.db, 'subscriptions');
    addDoc(ref, sub.toJSON());
  }
}
