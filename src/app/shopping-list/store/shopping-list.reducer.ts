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
                ...state, // make sure you copy everything from previous state
                ingredients: [
                    ...state.ingredients, // spread operator copies all the ingredients from current state and adds to this ingredients array we are creating to return
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
            const ingredient = state.ingredients[state.editedIngredientIndex]; // grab the ingredient and amount that is currently at that index in our current state of the ingredients array
            const updatedIngredient = { // defines the updated ingredient
                ...ingredient, // this line isn't really needed in this specific case but this line basically copies the old ingredient info at the provided index from above...
                ...action.payload // then we override it all with the new ingredient info
            };
            const updatedIngredients = [...state.ingredients]; // copies all the other ingredients from the current state of the ingredients array
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient; // replaces the old ingredient at the given index with the updated ingredient
        
            return { // now we return the new Ingredients list
                ...state,
                ingredients: updatedIngredients, // plus the updated ingredient
                editedIngredientIndex: -1,
                editedIngredient: null
            };
        case ShoppingListActions.DELETE_INGREDIENT:

            return {
                ...state,
                ingredients: state.ingredients.filter((ig, igIndex) => {
                    return igIndex !== state.editedIngredientIndex;
                }), // returns copy of ingredients array that has filtered out the ingredient at the given index
                editedIngredientIndex: -1,
                editedIngredient: null
            };
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: {...state.ingredients[action.payload]}
            }
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            }
        default:
            return state; // default will return initial state
    }
}