import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[appPlaceholder]'
})
export class PlaceholderDirective{
    constructor(public viewContainerRef: ViewContainerRef){ // gives access to pointer showing where the directive is used

    }
}