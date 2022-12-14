import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[];
  private igChangeSub: Subscription;

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.slService.getIngredients();
    this.igChangeSub = this.slService.ingredientsChanged // listens for ingredients changed event from the service
      .subscribe(
        (ingredients: Ingredient[]) => { // will update the ingredients array displayed on the page in reaction to event
          this.ingredients = ingredients;
        }
      )
  }

  onEditItem(index: number){
    this.slService.startedEditing.next(index); // startingEditing is a Subject so we can treat it like an observable and emit 
                                              // event information; in this case we emit the index in the array where
                                              // the specific ingredient that is being edited is located
  }

  ngOnDestroy(){
    this.igChangeSub.unsubscribe();
  }
}
