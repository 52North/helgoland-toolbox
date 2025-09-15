import { Directive, HostListener } from '@angular/core';

@Directive()
export abstract class ResizableComponent {
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.onResize();
  }

  protected abstract onResize(): void;
}
