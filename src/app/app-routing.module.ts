import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full'}, // pathMatch property now only redirects if the full path is empty
    { 
        path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule) // implementing lazy loading for recipes module
    },
    { 
        path: 'shopping-list', loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule) // implementing lazy loading for shoppinglist module
    },
    { 
        path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) // implementing lazy loading for auth module
    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})], // can enable preloading modules here
    exports: [RouterModule]
})

export class AppRoutingModule{

}