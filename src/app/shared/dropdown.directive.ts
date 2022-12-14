import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective{
    // inside the parenthesis it is basically accessing the class of the element and binding the addition of 'open' as one of the classes to our isOpen property
    // the open class is a built in bootstrap class that will open our dropdown
    @HostBinding('class.open') isOpen = false; // default is not open

    @HostListener('click') toggleOpen(){ // on click event calls this toggleOpen function
        this.isOpen = !this.isOpen; // toggles isOpen property
    }
}