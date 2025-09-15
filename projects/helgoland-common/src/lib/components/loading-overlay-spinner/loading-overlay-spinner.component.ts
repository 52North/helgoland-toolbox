import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'helgoland-loading-overlay-spinner',
  templateUrl: './loading-overlay-spinner.component.html',
  styleUrls: ['./loading-overlay-spinner.component.scss'],
  imports: [MatProgressSpinnerModule],
})
export class LoadingOverlaySpinnerComponent {
  readonly loadingHint = input<string>();
}
