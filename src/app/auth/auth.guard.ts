import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{
    constructor(private authService: AuthService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.authService.user.pipe(
            take(1), // avoids an ongoing subscription since we don't need it
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