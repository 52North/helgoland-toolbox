import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'helgoland-loading-overlay-spinner',
  templateUrl: './loading-overlay-spinner.component.html',
  styleUrls: ['./loading-overlay-spinner.component.scss'],
  imports: [
    MatProgressSpinnerModule,
    CommonModule
  ],
  standalone: true
})
export class LoadingOverlaySpinnerComponent {

  @Input() loadingHint: string | undefined;

}
