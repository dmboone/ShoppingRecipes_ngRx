import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm; // grabs form reference using view child
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if(stateData.editedIngredientIndex > -1 ){
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
      else{
        this.editMode = false;
      }
    });

    // the code below is now completed replaced in the ngRx version as seen above
    // this.subscription = this.slService.startedEditing  
    //   .subscribe( // subscribing to the startedEditing Subject, which acts similarly to an observable and also emits event data like event emitter
    //               // subscribing to the Subject allows us to react as soon as an ingredient is in editing mode
    //     (index: number) => { // grabbing event data; in this case it's the index where the ingredient is located in the array in shopping-list
    //       this.editedItemIndex = index;
    //       this.editMode = true;
    //       this.editedItem = this.slService.getIngredient(index);
    //       this.slForm.setValue({
    //         name: this.editedItem.name,
    //         amount: this.editedItem.amount
    //       });
    //     }
    // );
  }

  onSubmit(form: NgForm){
    const value = form.value; // grabs values from form
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode){ // if in edit mode call update ingredient
      // this.slService.updateIngredient(this.editedItemIndex, newIngredient); // using ngRx version instead now (see lines below)
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient)
      );
    }
    else{ // else just call add ingredient
      // this.slService.addIngredient(newIngredient); // using ngRx version instead now (see line below)
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editMode = false;
    form.reset();
  }

  onClear(){
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete(){
    // this.slService.deleteIngredient(this.editedItemIndex); // using ngRx version instead now (see line below)
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  ngOnDestroy(): void { // make sure to unsubscribe from observable to avoid memory leaks
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
