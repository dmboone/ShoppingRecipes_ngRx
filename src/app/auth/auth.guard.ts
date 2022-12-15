import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";
import * as fromApp from '../store/app.reducer';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{
    constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.store.select('auth').pipe( // now using ngRx
            take(1), // avoids an ongoing subscription since we don't need it
            map(authState => { // ngRx grabbing the user from the auth state
                return authState.user;
            }),
            map(user => {
            const isAuth = !!user; // converts a truish value to true or a falshish value to false

            if(isAuth){
                return true;
            }
            else{
                return this.router.createUrlTree(['/auth']);
            }
        }));
    }
}