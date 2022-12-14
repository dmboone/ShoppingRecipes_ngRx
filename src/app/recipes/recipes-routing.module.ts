import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesResolverService } from "./recipes-resolver.service";
import { RecipesComponent } from "./recipes.component";

const routes: Routes = [
    {
        path: '', 
        component: RecipesComponent, 
        canActivate: [AuthGuard],
        children: [ // these children will all have /recipes in front of it
            {path: '', component: RecipeStartComponent}, // must change to empty path when implementing lazy loading; path is instead shown in app-routing.module file
            {path: 'new', component: RecipeEditComponent}, // new should come before dynamic id path! otherwise angular will try to parse the word 'new' as an id rather than simply 'new' which is a predefined path
            {
                path: ':id', 
                component: RecipeDetailComponent,
                resolve: [RecipesResolverService]
            },
            {
                path: ':id/edit', 
                component: RecipeEditComponent,
                resolve: [RecipesResolverService]
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule{}