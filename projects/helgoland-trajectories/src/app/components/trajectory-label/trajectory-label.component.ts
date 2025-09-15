import { Component, input } from '@angular/core';
import { HelgolandTrajectory } from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'helgoland-trajectories-label',
  templateUrl: './trajectory-label.component.html',
  styleUrls: ['./trajectory-label.component.scss'],
  imports: [TranslateModule],
})
export class TrajectoryLabelComponent {
  readonly trajectory = input.required<HelgolandTrajectory>();
}
