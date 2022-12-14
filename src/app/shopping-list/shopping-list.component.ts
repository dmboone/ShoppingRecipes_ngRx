import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ingredients: Ingredient[]}>;
  private igChangeSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList'); // this gives an observable
    // this.ingredients = this.slService.getIngredients();
    // this.igChangeSub = this.slService.ingredientsChanged // listens for ingredients changed event from the service
    //   .subscribe(
    //     (ingredients: Ingredient[]) => { // will update the ingredients array displayed on the page in reaction to event
    //       this.ingredients = ingredients;
    //     }
    //   );
  }

  onEditItem(index: number){
    // replacing the line below with ngRx version
    // this.slService.startedEditing.next(index); // startingEditing is a Subject so we can treat it like an observable and emit 
                                              // event information; in this case we emit the index in the array where
                                              // the specific ingredient that is being edited is located
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy(){
    // this.igChangeSub.unsubscribe();
  }
}
