import { Directive, ElementRef, HostListener } from '@angular/core';
import { AfterContentChecked } from '@angular/core';

@Directive({
    selector: '[autoGrow]'
})
export class ElasticDirective implements AfterContentChecked {

    @HostListener('input', ['$event.target'])
    onInput(textArea: HTMLTextAreaElement): void {
        this.adjust();
    }

    constructor(public element: ElementRef) {
    }

    ngAfterContentChecked(): void {
        this.adjust();
    }

    adjust(): void {
        const nativeElement = this.element.nativeElement;
        nativeElement.style.overflow = 'hidden';
        nativeElement.style.height = 'auto';
        nativeElement.style.height = nativeElement.scrollHeight + 'px';
    }
}
