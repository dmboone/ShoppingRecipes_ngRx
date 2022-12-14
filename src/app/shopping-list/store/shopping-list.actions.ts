import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';

export class AddIngredient implements Action { // using the Action interface to build our shopping list actions
    readonly type = ADD_INGREDIENT; // must have this as per the Action interface

    // the payload is specific to the action; it's like the data attached to an action
    // in this case the AddIngredient action would naturally include the ingredient you want to add as the payload
    constructor(public payload: Ingredient){}
}

export class AddIngredients implements Action {
    readonly type = ADD_INGREDIENTS;

    constructor(public payload: Ingredient[]){}
}

export class UpdateIngredient implements Action {
    readonly type = UPDATE_INGREDIENT;

    constructor(public payload: {index: number, ingredient: Ingredient}){}
}

export class DeleteIngredient implements Action {
    readonly type = DELETE_INGREDIENT;

    constructor(public payload: number){}
}

export type ShoppingListActions = 
AddIngredient 
| AddIngredients 
| UpdateIngredient 
| DeleteIngredient;