import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy{
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective; // finds the first occurance of the PlaceholderDirective in the DOM
    
    private closeSub: Subscription;

    constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver, private store: Store<fromApp.AppState>){}

    ngOnInit(): void {
        this.store.select('auth').subscribe(authState => { // ngRx implementation to handle observable
            this.isLoading = authState.loading;
            this.error = authState.authError;
            if(this.error){
                this.showErrorAlert(this.error);
            }
        });
    }

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode; // just switches the isLoginMode value
    }

    onSubmit(form: NgForm){
        if(!form.valid){ // extra check to ensure the form is valid
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        let authObs: Observable<AuthResponseData>; // this allows us to not have to repeat ourselves since we handle the observable the exact same
                                                    // way in both login mode and signup mode

        this.isLoading = true;
        if(this.isLoginMode){ // confirms we are logging in
            // authObs = this.authService.login(email, password); // replacing with ngRx below
            this.store.dispatch(new AuthActions.LoginStart({
                email: email,
                password: password
            }));
        }
        else{ // not logging in so need so run signup method
            authObs = this.authService.signup(email, password);
        }
        
        // replacing this code with ngRx implementation instead (see ngOnInit)
        // authObs.subscribe( // subscribe to the authentication observable whether we are in logging in or signing up
        //     resData =>{
        //         console.log(resData);
        //         this.isLoading = false;
        //         this.router.navigate(['/recipes']); // navigate to recipes route on successful authentication
        //     },
        //     errorMessage => // specifics of errorMessage is now getting handled in the auth.service through a catchError pipe
        //     {
        //         console.log(errorMessage);
        //         this.error = errorMessage;
        //         this.showErrorAlert(errorMessage);
        //         this.isLoading = false;
        //     }
        // );

        form.reset(); // always reset form on submission
    }

    onHandleError(){
        this.error = null;
    }

    ngOnDestroy(): void {
        if(this.closeSub){
            this.closeSub.unsubscribe();
        }
    }

    private showErrorAlert(message: string){ // gets called and will add error component programmatically
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear(); // clears any components that may have been their before
        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(() => { // once close button clicked, remove modal
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }
}