import { Component, HostBinding, Input } from "@angular/core";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@Component({
  selector: 'helgoland-loading-overlay-progress-bar',
  templateUrl: './loading-overlay-progress-bar.component.html',
  styleUrls: ['./loading-overlay-progress-bar.component.scss'],
  imports: [
    MatProgressBarModule
  ],
  standalone: true
})
export class LoadingOverlayProgressBarComponent {

  @Input() progressBarPosition: 'top' | 'bottom' | undefined;

  @HostBinding('style.align-items') get alignItems() {
    switch (this.progressBarPosition) {
      case 'top':
        return 'flex-start';
      default:
        return 'flex-end';
    }
  }

}
