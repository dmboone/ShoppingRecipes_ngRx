import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
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
    private storeSub: Subscription;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private store: Store<fromApp.AppState>){}

    ngOnInit(): void {
        this.storeSub = this.store.select('auth').subscribe(authState => { // ngRx implementation to handle observable
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

        this.isLoading = true;
        if(this.isLoginMode){ // confirms we are logging in
            this.store.dispatch(new AuthActions.LoginStart({
                email: email,
                password: password
            }));
        }
        else{ // not logging in so need so run signup method
            this.store.dispatch(new AuthActions.SignupStart({
                email: email,
                password: password
            }))
        }

        form.reset(); // always reset form on submission
    }

    onHandleError(){
        this.store.dispatch(new AuthActions.ClearError());
    }

    ngOnDestroy(): void {
        if(this.storeSub){
            this.storeSub.unsubscribe();
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