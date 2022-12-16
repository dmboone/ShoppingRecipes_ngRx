import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { map, switchMap } from "rxjs/operators";
import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipe.actions';

@Injectable()
export class RecipeEffects{
    @Effect()
    fetchRecipes = this.actions$
    .pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.http.get<Recipe[]>// specify the type (Recipe[]) to avoid any typescript errors so the setRecipes method knows what type it's taking in 
            ( 
                'https://shoppingrecipes-b163e-default-rtdb.firebaseio.com/recipes.json'
            )
        }),
        map(recipes => { // we will use the map operator here to alter the data that we grab to make sure that even if a recipe has no ingredients, we give it an empty ingredients array to avoid bugs
            return recipes.map(recipe => { // for every recipe in the recipe array...
                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []} // create a new recipe object with everything currently inside using the sspread operator (...) and then attach to the ingredients and return this new recipe object
                // but for the ingredients we check to see if the recipe already has an ingredients array, if so, we set it to the ingredients property and if not we set it to an empty array
            }); // map here means something different here; this is a javascript array method that allows us to transform the elements in the array
        }),
        map(recipes => {
            return new RecipesActions.SetRecipes(recipes);
        })
    );

    constructor(private actions$: Actions, private http: HttpClient){}
}