import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { throwError } from 'rxjs';
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from '../../environments/environment';
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData{ // defining the firebase sign up response; we export this so we can use it in the auth component as well
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean; // this is an optional field because the signup request does not provide this but the login request does
}

@Injectable({providedIn: 'root'})
export class AuthService{

    // user = new BehaviorSubject<User>(null); // can get access to the currently active user even if we only subscribe after the user has been emitted
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>){}

    autoLogin(){
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if(!userData){
            return;
        }
        else{
            const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

            if(loadedUser.token){
                // this.user.next(loadedUser); //replacing with ngRx version below
                this.store.dispatch(new AuthActions.AuthenticateSuccess( // ngRx version
                    {
                        email: loadedUser.email,
                        userId: loadedUser.id,
                        token: loadedUser.token,
                        expirationDate: new Date(userData._tokenExpirationDate)
                    }
                ));
                const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.autoLogout(expirationDuration);
            }
        }
    }

    logout(){
    //    this.user.next(null); // replace with ngRx version below
        this.store.dispatch(new AuthActions.Logout()); // ngRx version
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){ // if a timer is already running when user clicks logout
            clearTimeout(this.tokenExpirationTimer); // clears it
        }
        this.tokenExpirationTimer = null; // resets it for the next login session
    }

    autoLogout(expirationDuration: number){
        this.tokenExpirationTimer = setTimeout(()=>{ // logs out after the expiration duration has passed
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){ // we define how to handle authentication here in one place since we will reuse this for both login and signup
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000); // calculating the time at which the user token will expire
        const user = new User(email, userId, token, expirationDate); // creating a user based on the model we defined in user.model.ts
        // this.user.next(user); // replace with ngRx version
        this.store.dispatch(new AuthActions.AuthenticateSuccess({ //ngRx version
            email: email,
            userId: userId,
            token: token,
            expirationDate: expirationDate
        }));
        this.autoLogout(expiresIn * 1000); //converts to milliseconds
        localStorage.setItem('userData', JSON.stringify(user)); // saving user info to local storage so that you can refresh without being logged out
    }

    private handleError(errorRes: HttpErrorResponse){ // we defined how to handle the error here in one place since we will reuse this for both login and signup
        let errorMessage = 'An unknown error occured!'; // default error message

            if(!errorRes.error || !errorRes.error.error){ // checks if error format is different than expected
                return throwError(errorMessage);
            }

            switch(errorRes.error.error.message){ // switch to check for cases in which we can deliver a more specific error message
                case 'EMAIL_EXISTS':
                    errorMessage = 'This email exists already';
                    break;
                case 'EMAIL_NOT_FOUND':
                    errorMessage = 'This email does not exist';
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage = 'This password is not correct';
                    break;
            }

            return throwError(errorMessage);
    }
}