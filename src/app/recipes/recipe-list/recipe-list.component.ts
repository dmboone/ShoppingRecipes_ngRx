import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(
              private router: Router, // inject router to switch path when clicking New Recipe button ('onNewRecipe' function below)
              private route: ActivatedRoute, // need to inject ActivatedRoute so we can switch paths relative to our current route
              private store: Store<fromApp.AppState>) { } 

  ngOnInit(): void {
    this.subscription = this.store.select('recipes')
    .pipe(map(recipesState => recipesState.recipes))
    .subscribe( // listen for if the list of recipes has changed
      (recipes: Recipe[]) => {
        this.recipes = recipes; // then update recipes array
      }
    );
  }

  onNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.route}); // relative route
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
