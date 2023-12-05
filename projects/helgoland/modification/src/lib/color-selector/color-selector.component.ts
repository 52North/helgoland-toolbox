import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ColorPickerModule } from "ngx-color-picker";

@Component({
  selector: "n52-color-selector",
  templateUrl: "./color-selector.component.html",
  standalone: true,
  imports: [ColorPickerModule]
})
export class ColorSelectorComponent {

  @Input({ required: true })
  public color!: string;

  @Input({ required: true })
  public colorList!: string[];

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onColorChange: EventEmitter<string> = new EventEmitter<string>();

}
