import { Component, Input, output } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'n52-color-selector',
  templateUrl: './color-selector.component.html',
  imports: [ColorPickerModule],
})
export class ColorSelectorComponent {
  @Input({ required: true })
  public color!: string;

  @Input({ required: true })
  public colorList!: string[];

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onColorChange = output<string>();
}
