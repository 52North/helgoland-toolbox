import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'n52-color-selector',
    templateUrl: './color-selector.component.html'
})
export class ColorSelectorComponent {

    @Input()
    public color: string;

    @Input()
    public colorList: string[];

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output()
    public onColorChange: EventEmitter<string> = new EventEmitter<string>();

}
