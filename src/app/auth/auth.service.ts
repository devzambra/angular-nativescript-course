import { ChallengeService } from './../challenges/challenge.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject, of } from 'rxjs';
import { alert } from 'tns-core-modules/ui/dialogs';
import { User } from './user.model';
import { RouterExtensions } from 'nativescript-angular/router';
import { setString, getString, hasKey, remove } from 'tns-core-modules/application-settings';

const FIREBASE_API_KEY = 'AIzaSyCWvPV-lUiIvtd0hON57DvTBOEZNvoJc9Y';


interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

    private _user = new BehaviorSubject<User>(null);
    private _tokenExpirationTimer: number;

    constructor(private http: HttpClient, private router: RouterExtensions) {}

    get user() {
        return this._user.asObservable();
    }

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${FIREBASE_API_KEY}`,
        {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(error => {
            this.handleError(error.error.error.message);
            return throwError(error);
        }),
        tap(resData => {
            if(resData && resData.idToken) {
                this.handleLogin(email, resData.idToken, resData.localId, parseInt(resData.expiresIn));
            }
        }));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${FIREBASE_API_KEY}`,
        {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(error => {
            this.handleError(error.error.error.message);
            return throwError(error);
        }),
        tap(resData => {
            if(resData && resData.idToken) {
                this.handleLogin(email, resData.idToken, resData.localId, parseInt(resData.expiresIn));
            }
        }));
    }

    logout() {
        this._user.next(null);
        remove('userData');

        if(this._tokenExpirationTimer) {
            clearTimeout(this._tokenExpirationTimer);
        }
        this.router.navigate(['/auth'], { clearHistory: true});

    }

    private handleLogin(email: string, token: string, userId: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);

        setString('userData', JSON.stringify(user));
        this.autoLogout(user.timeToExpiry);
        this._user.next(user);
    }

    autoLogin() {
        if (!hasKey('userData')) {
            return of(false);
        }
        const userData: {email: string, id: string, _token: string, _tokenExpirationDate: Date} = JSON.parse(getString('userData'));

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if(loadedUser.isAuth) {
            this._user.next(loadedUser);
            this.autoLogout(loadedUser.timeToExpiry);
            return of(true);
        }

        return of(false);

    }

    autoLogout(expiryDuration: number) {
        this._tokenExpirationTimer = setTimeout( () => this.logout() , expiryDuration);
    }

    private handleError(errorMessage: string) {
        switch(errorMessage) {
            case 'EMAIL_EXISTS':
                alert('This email address already exists!');
                break;
            case 'INVALID_PASSWORD':
                alert('Your password is invalid!');
                break;
            default:
                alert('Authentication failed, check your credentials!');
        }
    }
}
