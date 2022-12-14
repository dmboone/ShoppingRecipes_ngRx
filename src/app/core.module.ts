import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import { RecipeService } from "./recipes/recipe.service";

@NgModule({
    providers: [
        RecipeService, // remember don't need to export services 
        {
          provide: HTTP_INTERCEPTORS, 
          useClass: AuthInterceptorService, 
          multi: true
        }
    ]
})
export class CoreModule {}