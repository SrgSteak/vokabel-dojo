import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, tap, startWith } from 'rxjs/operators';
import firebase from 'firebase';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: string;
  settings?: Settings;
}

interface Settings {
  fontStyle: string;
}


@Injectable({ providedIn: 'root' })
export class AuthService {

  user: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {

    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return of(null)
        }
      }),
      // Add these lines to set/read the user data to local storage
      tap(user => localStorage.setItem('user', JSON.stringify(user))),
      startWith(JSON.parse(localStorage.getItem('user')))
    )
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }


  private oAuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
      })
  }

  //TODO: provide email signup, auth, signinLink and forgotPassword
  // emailLogin() {
  //   const provider = new auth.EmailAuthProvider();
  //   return this.oAuthLogin(provider);
  // }

  // private Login(provider) {
  //   return this.afAuth.auth.signInWithEmailAndPassword()
  // }


  public updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    userRef.valueChanges().subscribe(storedUser => {
      if (!storedUser) { // new user!
        storedUser = {
          uid: user.uid,
          email: user.email,
          role: 'user'
        };
      }
      console.log(storedUser);
      storedUser.email = user.email;
      storedUser.displayName = user.displayName;
      storedUser.uid = user.uid;
      storedUser.role = storedUser.role ? storedUser.role : 'user'
      storedUser.settings = storedUser.settings ? storedUser.settings : { fontStyle: 'serif' };

      userRef.set(storedUser, { merge: true });
    });

  }

  signOut() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }
}