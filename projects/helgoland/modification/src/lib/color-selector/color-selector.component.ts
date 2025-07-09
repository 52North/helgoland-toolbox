import { Component, input, output } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'n52-color-selector',
  templateUrl: './color-selector.component.html',
  imports: [ColorPickerModule],
})
export class ColorSelectorComponent {
  public readonly color = input.required<string>();

  public readonly colorList = input.required<string[]>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onColorChange = output<string>();
}
