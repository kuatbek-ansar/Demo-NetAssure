import { Directive, Renderer, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[focusElement]'
})

export class FocusElementDirective implements OnInit {
  constructor(public _renderer: Renderer, public _elementRef: ElementRef) {
  }

  ngOnInit() {
    this.setFocus();
  }

  setFocus() {
    this._renderer.invokeElementMethod(
      this._elementRef.nativeElement, 'focus', []
    );
  }
}
