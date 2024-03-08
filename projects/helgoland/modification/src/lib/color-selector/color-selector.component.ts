import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Required } from '@helgoland/core';

@Component({
    selector: 'n52-color-selector',
    templateUrl: './color-selector.component.html'
})
export class ColorSelectorComponent {

    @Input()
    @Required
    public color!: string;

    @Input()
    @Required
    public colorList!: string[];

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onColorChange: EventEmitter<string> = new EventEmitter<string>();

}
