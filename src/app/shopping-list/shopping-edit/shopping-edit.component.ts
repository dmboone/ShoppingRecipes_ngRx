import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm; // grabs form reference using view child
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing
      .subscribe( // subscribing to the startedEditing Subject, which acts similarly to an observable and also emits event data like event emitter
                  // subscribing to the Subject allows us to react as soon as an ingredient is in editing mode
        (index: number) => { // grabbing event data; in this case it's the index where the ingredient is located in the array in shopping-list
          this.editedItemIndex = index;
          this.editMode = true;
          this.editedItem = this.slService.getIngredient(index);
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        }
      );
  }

  onSubmit(form: NgForm){
    const value = form.value; // grabs values from form
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode){ // if in edit mode call update ingredient
      this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    }
    else{ // else just call add ingredient
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onClear(){
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete(){
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  ngOnDestroy(): void { // make sure to unsubscribe from observable to avoid memory leaks
    this.subscription.unsubscribe();
  }
}
