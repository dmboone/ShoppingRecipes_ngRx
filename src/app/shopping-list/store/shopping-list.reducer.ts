import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

export interface AppState{
    shoppingList: State;
}

const initialState: State = { // states should normally be javascript objects
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
};

// our reducer will take in the current state and the action we want to perform 
// notice that state is given a default value of initialState
export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions){
    switch (action.type){
        case ShoppingListActions.ADD_INGREDIENT: // convention is to use all uppercase for your action identifiers, but the names themselves are up to you
            // must never edit the existing state, instead return a new object which will replace the old state
            return {
                ...state, // good practice to call spread operator here to make sure you copy everything from previous state but in this case this line isn't necessary just good habit
                ingredients: [
                    ...state.ingredients, // spread operator copies everything from current state (i.e. the current list of ingredients) and adds to this ingredients array we are creating to return
                    action.payload // lastly we will add the new ingredient
                ]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [
                    ...state.ingredients,
                    ...action.payload // adds the multiple new ingredients
                ]
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
            const ingredient = state.ingredients[action.payload.index]; // grab the ingredient and amount that is currently at that index in our current state of the ingredients array
            const updatedIngredient = { // defines the updated ingredient
                ...ingredient, // this line isn't really needed in this specific case but this line basically copies the old ingredient info at the provided index from above...
                ...action.payload.ingredient // then we override it all with the new ingredient info
            };
            const updatedIngredients = [...state.ingredients]; // copies all the other ingredients from the current state of the ingredients array
            updatedIngredients[action.payload.index] = updatedIngredient; // replaces the old ingredient at the given index with the updated ingredient
        
            return { // now we return the new Ingredients list
                ...state,
                ingredients: updatedIngredients // plus the updated ingredient
            };
        case ShoppingListActions.DELETE_INGREDIENT:

            return {
                ...state,
                ingredients: state.ingredients.filter((ig, igIndex) => {
                    igIndex !== action.payload;
                }) // returns copy of ingredients array that has filtered out the ingredient at the given index
            };
        default:
            return state; // default will return initial state
    }
}