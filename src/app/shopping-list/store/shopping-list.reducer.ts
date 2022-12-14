import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

const initialState = { // states should normally be javascript objects
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ]
};

// our reducer will take in the current state and the action we want to perform 
// notice that state is given a default value of initialState
export function shoppingListReducer(state = initialState, action: ShoppingListActions.AddIngredient){ 
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
        default:
            return state; // default will return initial state
    }
}