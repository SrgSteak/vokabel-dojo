import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActionCodeSettings, Auth, GoogleAuthProvider, isSignInWithEmailLink, OAuthProvider, sendSignInLinkToEmail, signInWithEmailLink, signInWithPopup } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap, tap, distinctUntilChanged } from 'rxjs/operators';
import _ from 'lodash';
import { authState } from 'rxfire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { docData } from 'rxfire/firestore';

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
  private _user: User = localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')) : null;

  constructor(
    private afAuth: Auth,
    private db: Firestore,
    private router: Router
  ) {

    //// Get auth data, then get firestore user document || null
    this.user = authState(this.afAuth).pipe(
      switchMap(user => {
        if (user && user.uid) {
          const ref = doc(this.db, `users/${user.uid}`);
          return docData(ref);
        } else {
          localStorage.removeItem('user')
          return of(null)
        }
      }),
      // Add these lines to set/read the user data to local storage
      tap(user => {
        if (user && user.uid) {
          this._user = user;
          localStorage.setItem('user', JSON.stringify(user))
        }
      })
    )
  }

  getUser(): User | null {
    return this._user;
  }

  googleLogin() {
    const provider = new GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  appleLogin() {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    provider.setCustomParameters({ locale: 'de' });
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return signInWithPopup(this.afAuth, provider)
      .then((credential) => {
        this.updateUserData(credential.user)
      })
  }

  emailLogin(email: string, username: string) {
    const settings: ActionCodeSettings = {
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
    sendSignInLinkToEmail(this.afAuth, email, settings).then(() => {
      window.alert('E-Mail wurde erfolgreich gesendet. Bitte prüfe dein Postfach und folge dem Link.');
      window.localStorage.setItem('magicLinkEmail', email);
      window.localStorage.setItem('magicLinkName', username);
    }).catch((error) => {
      window.alert('Es ist ein Fehler aufgetreten. Bitte überprüfe deine Eingabe und versuche es zu einem späteren Zeitpunkt noch einmal.' + error.message);
      console.error(error);
    });
  }

  emailValidateLogin() {
    if (isSignInWithEmailLink(this.afAuth, window.location.href)) {
      let email = window.localStorage.getItem('magicLinkEmail');
      if (!email) {
        email = window.prompt('Bitte die E-Mail eingeben von der dieser Link stammt');
      }

      signInWithEmailLink(this.afAuth, email, window.location.href).then((result) => {
        window.localStorage.removeItem('magicLinkEmail');
        const user = result.user;
        let username = window.localStorage.getItem('magicLinkName');
        window.localStorage.removeItem('magicLinkName');
        if (!username) {
          username = window.prompt('Bitte geben Sie noch ihren Usernamen an');
        }
        this.updateUserData(user);
        this.router.navigate(['/']);
      }).catch((error) => {
        window.alert('Bei der überprüfung ist ein Fehler aufgetreten.');
        console.error(error);
      });
    }
  }

  public updateUserData(user) {
    // Sets user data to firestore on login
    if (user.uid) {
      const userRef = doc(this.db, `users/${user.uid}`); // no document with this uid? storedUser will be undefined but can be added to the db
      docData(userRef).pipe(
        distinctUntilChanged((prev, curr) => _.isEqual(prev, curr))
      ).subscribe(storedUser => {
        if (!storedUser) { // new user!
          storedUser = {
            uid: user.uid,
            email: user.email,
            role: 'user'
          };
        }

        storedUser.email = user.email;
        storedUser.displayName = user.displayName;
        storedUser.uid = user.uid;
        storedUser.role = storedUser.role ? storedUser.role : 'user'
        storedUser.settings = storedUser.settings ? storedUser.settings : { fontStyle: 'serif' };

        setDoc(userRef, storedUser, { merge: true }).then(() => {
          localStorage.setItem('user', JSON.stringify(user));
        });
      });
    } else { // this is a new user, unknown to the firebase db. create him
      console.log('user has no uid!', user);
    }
  }

  signOut() {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    });
  }

  /**
   * deletes the login user from the firebase auth
   */
  deleteAccount() {
    this.afAuth.currentUser.delete().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    }, (error) => {
      alert('Du musst dich neu Anmelden, um diese Aktion zu bestätigen. ' + error);
    });
  }
}