import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot,  RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
import { Actions, ofType } from '@ngrx/effects';
import { take } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]>{
    constructor(private store: Store<fromApp.AppState>, private recipesService: RecipeService, private actions$: Actions){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const recipes = this.recipesService.getRecipes();

        if(recipes.length === 0){
            // return this.dataStorageService.fetchRecipes();
            this.store.dispatch(new RecipesActions.FetchRecipes());
            return this.actions$.pipe(
                ofType(RecipesActions.SET_RECIPES),
                take(1) // just take the first instance then unsubscribe
            );
        }
        else{
            return recipes;
        }
    }
}