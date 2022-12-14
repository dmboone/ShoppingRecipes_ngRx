import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { exhaustMap } from "rxjs/operators";
import { take } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{ // using an interceptor to add our query parameters (user token for authentication)
    constructor(private authService: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.user.pipe(
            take(1), // take operator allows us to only take one value from that observable and then automatically unsubscribe
            exhaustMap(user => { // exhaustMap waits for first observable (take) to complete, gives us that data, and then replaces that observable with the next observable (http request) and uses the other rxjs operators back in the data storage service
                if(!user){ // only use interceptor if there is actually a user, so not during sign in
                    return next.handle(req);
                }
                
                const modifiedReq = req.clone({ // modifies the request, adding the user token in the query params
                    params: new HttpParams().set('auth', user.token)
                });
                return next.handle(modifiedReq); // now returns back to data-storage service and any other place that calls this interceptor
            })
        );
    }
}
