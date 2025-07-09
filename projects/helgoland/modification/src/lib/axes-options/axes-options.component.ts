import { Component, output } from '@angular/core';

@Component({
  selector: 'n52-axes-options',
  templateUrl: './axes-options.component.html',
  standalone: true,
})
export class AxesOptionsComponent {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onChangeYAxesVisibility = output<void>();

  public changeYAxesVisibility() {
    this.onChangeYAxesVisibility.emit();
  }
}
