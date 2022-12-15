import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import * as fromApp from './store/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/store/auth.effects';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // must include this import to use the http client
    AppRoutingModule,
    StoreModule.forRoot(fromApp.appReducer), // enables us to use our ngRx reducers
    EffectsModule.forRoot([AuthEffects]),
    SharedModule,
    CoreModule // now contains our services which we can use application wide and make sure there is only one instance
              // so any changes should permeate throughout entire application
  ],                                              
  bootstrap: [AppComponent],
})
export class AppModule { }
