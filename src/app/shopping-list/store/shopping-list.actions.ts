import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';

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

export type ShoppingListActions = AddIngredient | AddIngredients;