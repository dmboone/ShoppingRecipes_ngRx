import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { of } from 'rxjs';

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

export class AuthEffects{
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
                catchError(error => {
                    of(); // must return a non error observable by using of()
                }),
                map(resData => {
                    of(); // must return a non error observable by using of()
                }
                )
            );
        }),

    );

    constructor(
        private actions$: Actions, // naming convention for effects is usually $
        private http: HttpClient,
    ){} 
}