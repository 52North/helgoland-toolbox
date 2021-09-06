import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'helgoland-loading-overlay-progress-bar',
  templateUrl: './loading-overlay-progress-bar.component.html',
  styleUrls: ['./loading-overlay-progress-bar.component.scss']
})
export class LoadingOverlayProgressBarComponent {

  @Input() progressBarPosition: 'top' | 'bottom';

  @HostBinding('style.align-items') get alignItems() {
    switch (this.progressBarPosition) {
      case 'top':
        return 'flex-start';
      default:
        return 'flex-end';
    }
  }

}
