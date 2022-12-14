import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'}) // always need to add this if you are going to inject a service
// can either list the service under providers in app module or do what we do above by adding {providedIn: 'root'} to the Injectable
export class DataStorageService{
    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService){} // create the http client variable

    storeRecipes(){
        const recipes = this.recipeService.getRecipes();

        // could do a post request if this was just one recipe but since multiple, firebase's put request
        // allows us to automatically override all the data stored under that node, so more efficient to
        // use put in this case

        // note on the url - the first part links to our firebase database, then after the slash we
        // name the node what we want - in this case, recipes makes sense
        // lastly, the .json is just required on firebase's end - we are basically making a json file
        // to store this recipes information

        this.http.put('https://shoppingrecipes-b163e-default-rtdb.firebaseio.com/recipes.json', recipes)
            .subscribe(response => { // this request only gets sent if we subscribe to it!!!
                                    // you could also subscribe in the component that calls it if you wanted to do something based on the response,
                                    // like show a loader or something, but not needed here so we just subscribe right here
                console.log(response); // just printing out the response
            });
    }

    fetchRecipes(){      
            return this.http.get<Recipe[]>// specify the type (Recipe[]) to avoid any typescript errors so the setRecipes method knows what type it's taking in 
            ( 
                'https://shoppingrecipes-b163e-default-rtdb.firebaseio.com/recipes.json'
            )
            .pipe(
                map(recipes => { // we will use the map operator here to alter the data that we grab to make sure that even if a recipe has no ingredients, we give it an empty ingredients array to avoid bugs
                    return recipes.map(recipe => { // for every recipe in the recipe array...
                        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []} // create a new recipe object with everything currently inside using the sspread operator (...) and then attach to the ingredients and return this new recipe object
                        // but for the ingredients we check to see if the recipe already has an ingredients array, if so, we set it to the ingredients property and if not we set it to an empty array
                    }); // map here means something different here; this is a javascript array method that allows us to transform the elements in the array
                }),
                tap(recipes => { // allows us to execute some code here in place with altering the data
                    this.recipeService.setRecipes(recipes);
                }) // we will now subscribe in the header component instead
            );
    }
}