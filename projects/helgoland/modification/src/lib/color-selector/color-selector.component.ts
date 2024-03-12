import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Required } from "@helgoland/core";
import { ColorPickerModule } from "ngx-color-picker";

@Component({
  selector: "n52-color-selector",
  templateUrl: "./color-selector.component.html",
  standalone: true,
  imports: [ColorPickerModule]
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
