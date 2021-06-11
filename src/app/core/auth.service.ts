import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, tap, startWith, distinctUntilChanged } from 'rxjs/operators';
import firebase from 'firebase';
import _ from 'lodash';

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
        if (user && user.uid) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return of(null)
        }
      }),
      // Add these lines to set/read the user data to local storage
      tap(user => {
        if (user && user.uid) {
          localStorage.setItem('user', JSON.stringify(user))
        }
      }),
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

  emailLogin(email: string, username: string) {
    const settings: firebase.auth.ActionCodeSettings = {
      url: 'https://vokabeldojo.web.app/user/finish-magic-link',
      handleCodeInApp: true,
      iOS: {
        bundleId: 'app.web.vokabeldojo'
      },
      android: {
        packageName: 'app.web.vokabeldojo',
        installApp: true,
        minimumVersion: '12'
      },
      dynamicLinkDomain: 'vokabeldojo.page.link'
    }
    this.afAuth.sendSignInLinkToEmail(email, settings).then(() => {
      window.alert('E-Mail wurde erfolgreich gesendet. Bitte prüfe dein Postfach und folge dem Link.');
      window.localStorage.setItem('magicLinkEmail', email);
      window.localStorage.setItem('magicLinkName', username);
    }).catch((error) => {
      window.alert('Es ist ein Fehler aufgetreten. Bitte überprüfe deine Eingabe und versuche es zu einem späteren Zeitpunkt noch einmal.' + error.message);
      console.error(error);
    });
  }

  emailValidateLogin() {
    if (this.afAuth.isSignInWithEmailLink(window.location.href)) {
      let email = window.localStorage.getItem('magicLinkEmail');
      if (!email) {
        email = window.prompt('Bitte die E-Mail eingeben von der dieser Link stammt');
      }

      this.afAuth.signInWithEmailLink(email, window.location.href).then((result) => {
        window.localStorage.removeItem('magicLinkEmail');
        const user = result.user;
        let username = window.localStorage.getItem('magicLinkName');
        window.localStorage.removeItem('magicLinkName');
        if (!username) {
          username = window.prompt('Bitte geben Sie noch ihren Usernamen an');
        }
        user.updateProfile({ displayName: username }).then(() => {
          console.log(result.user, result);
          this.updateUserData(user);
          this.router.navigate(['/']);
        });
      }).catch((error) => {
        window.alert('Bei der überprüfung ist ein Fehler aufgetreten.');
        console.error(error);
      });
    }
  }

  public updateUserData(user) {
    // Sets user data to firestore on login
    console.log(user);
    let userRef: AngularFirestoreDocument<User>;
    if (user.uid) {
      userRef = this.afs.doc(`users/${user.uid}`); // no document with this uid? storedUser will be undefined but can be added to the db
      userRef.valueChanges().pipe(
        distinctUntilChanged((prev, curr) => _.isEqual(prev, curr))
      ).subscribe(storedUser => {
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
    } else { // this is a new user, unknown to the firebase db. create him
      console.log('user has no uid!', user);
    }
  }

  signOut() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }
}