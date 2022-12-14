import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(private recipeService: RecipeService, // inject Recipe service
              private router: Router, // inject router to switch path when clicking New Recipe button ('onNewRecipe' function below)
              private route: ActivatedRoute) { } // need to inject ActivatedRoute so we can switch paths relative to our current route

  ngOnInit(): void {
    this.subscription = this.recipeService.recipesChanged
      .subscribe( // listen for if the list of recipes has changed
        (recipes: Recipe[]) => {
          this.recipes = recipes; // then update recipes array
        }
      );
    this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.route}); // relative route
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
