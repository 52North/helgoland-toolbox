import { Component, Input } from '@angular/core';

@Component({
  selector: 'helgoland-loading-overlay-spinner',
  templateUrl: './loading-overlay-spinner.component.html',
  styleUrls: ['./loading-overlay-spinner.component.scss']
})
export class LoadingOverlaySpinnerComponent {

  @Input() loadingHint: string;

}
