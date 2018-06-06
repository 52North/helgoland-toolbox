import { HostListener } from '@angular/core';

export abstract class ResizableComponent {

    @HostListener('window:resize', ['$event'])
    public onWindowResize(event: Event) {
        this.onResize();
    }

    protected abstract onResize(): void;

}
