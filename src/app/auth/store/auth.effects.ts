import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

// effects files allow you to perform other actions or sideffects that you wouldn't
// handle in the reducer/things that are not changing the state of anything but are
// still necessary for things to still work; so basically a lot of the stuff that the
// auth service is handling right now we will migrate to this file instead

// it would still work to leave those things in the service but this is so
// we can practice completely migrating everything over to ngRx

export interface AuthResponseData{ // defining the firebase sign up response; we export this so we can use it in the auth component as well
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean; // this is an optional field because the signup request does not provide this but the login request does
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000); // calculating the time at which the user token will expire
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
        redirect: true
    });
};

const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error occured!'; // default error message
    
    if(!errorRes.error || !errorRes.error.error){ // checks if error format is different than expected
        return of(new AuthActions.AuthenticateFail(errorMessage));
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

    return of(new AuthActions.AuthenticateFail(errorMessage)); // must return a non error observable by using of()
};

@Injectable()
export class AuthEffects{
    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>( // <> tells Typescript that the response will be of type AuthResponseData, which we have defined in the interface above
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey, // this is the endpoint for the signup feature of firebase's authentication api
                { // firebase requires us to provide this information when making a post request to their authentication api for sign up
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true
                }
            )
            .pipe(
                tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                }),
                map(resData => {
                    return handleAuthentication(
                        +resData.expiresIn, 
                        resData.email, 
                        resData.localId, 
                        resData.idToken
                    );
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                }) 
            )
        })
    );

    @Effect() // need to add this decorator so that this is recognized as an effect
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey, 
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe( // will need to call pipe at a different level to handle catching errors without killing the observable
                tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                }),
                map(resData => {
                    return handleAuthentication(
                        +resData.expiresIn, 
                        resData.email, 
                        resData.localId, 
                        resData.idToken
                    );
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            );
        })
    );

    @Effect({dispatch: false}) // letting ngRx know that this effect doesn't yield a dispatchable action at the end
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthActions.AuthenticateSuccess)=>{
            if(authSuccessAction.payload.redirect){
                this.router.navigate(['./']);
            }
        })
    );

    @Effect()
    autoLogin = this.actions$
    .pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(()=> {
            const userData: {
                email: string;
                id: string;
                _token: string;
                _tokenExpirationDate: string;
            } = JSON.parse(localStorage.getItem('userData'));
    
            if(!userData){
                return {type: 'DUMMY'};
            }
            else{
                const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    
                if(loadedUser.token){
                    const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                    this.authService.setLogoutTimer(expirationDuration);
                    return new AuthActions.AuthenticateSuccess( // ngRx version
                        {
                            email: loadedUser.email,
                            userId: loadedUser.id,
                            token: loadedUser.token,
                            expirationDate: new Date(userData._tokenExpirationDate),
                            redirect: false
                        }
                    );
                }

                return {type: 'DUMMY'};
            }  
        })
    );

    @Effect({dispatch: false})
    authLogout = this.actions$
    .pipe(
        ofType(AuthActions.LOGOUT), 
        tap(() => {
            this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
    }));

    constructor(
        private actions$: Actions, // naming convention for effects is usually $
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ){} 
}