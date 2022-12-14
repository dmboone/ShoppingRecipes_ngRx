import { Ingredient } from "../shared/ingredient.model";

const initialState = { // states should normally be javascript objects
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ]
};

export function shoppingListReducer(state = initialState, action){ // our reducer will take in the current state and the action we want to perform 
    // notice above that state is given a default value of initialState
}