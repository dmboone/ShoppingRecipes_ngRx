import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  ngOnInit(): void {
    this.route.params
      .subscribe( // checks any time the route parameters change so we can dynamically change what we show accordingly
        (params: Params) => {
          this.id = +params['id']; // keeps the id up to date anytime the route parameters change
          this.editMode = params['id'] != null; // determines whether we are in edit mode
                                                // if there is an id param in the route, editMode is true and we are editing a recipe.
                                                // if there is no id param in the route (would give us null), then editMode is false
                                                // and this is a new recipe.
          this.initForm(); // initializes form
        }
      )
  }

  onSubmit(){
    if(this.editMode){
      // this would work but even faster way!
      // const newRecipe = new Recipe(
      //   this.recipeForm.value['name'], 
      //   this.recipeForm.value['description'],
      //   this.recipeForm.value['imagePath'],
      //   this.recipeForm.value['ingredients']);

      // this.recipeService.updateRecipe(this.id, newRecipe);

      // since this is a reactive form and we've done validation on the fields can simply pass in the value of the entire recipeForm!
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    }
    else{
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel(); // navigates away
  }

  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')) //need to cast to form array first
    .push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    }))
  }

  onDeleteIngredient(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route}); // navigate away up one level
  }

  private initForm(){
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if(this.editMode){ // if in edit mode grabs values for specific recipe
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if(recipe['ingredients']){ // if recipe has ingredients
        for(let ingredient of recipe.ingredients){
          recipeIngredients.push( // putting each ingredient and it's amount into a form group and pushing it onto our form array
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]) // regular expression to make sure number is greater than 0
            })
          )
        }
      }
    }

    this.recipeForm = new FormGroup({ // creates new form with either empty fields or fields that are being edited from a recipe in edit mode
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }
}
