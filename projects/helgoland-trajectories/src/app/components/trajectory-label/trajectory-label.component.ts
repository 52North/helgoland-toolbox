import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HelgolandTrajectory, Required } from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'helgoland-trajectories-label',
  templateUrl: './trajectory-label.component.html',
  styleUrls: ['./trajectory-label.component.scss'],
  imports: [
    CommonModule,
    TranslateModule
  ],
  standalone: true
})
export class TrajectoryLabelComponent {

  @Input()
  @Required
  trajectory!: HelgolandTrajectory;

}
