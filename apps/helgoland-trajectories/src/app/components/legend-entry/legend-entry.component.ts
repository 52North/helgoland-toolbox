import { Component } from '@angular/core';
import { TrajectoryEntryComponent } from '@helgoland/depiction';

@Component({
  selector: 'helgoland-trajectories-legend-entry',
  templateUrl: './legend-entry.component.html',
  styleUrls: ['./legend-entry.component.scss']
})
export class LegendEntryComponent extends TrajectoryEntryComponent {

  confirmColor(color: string) {
    console.log(color);
    this.datasetOptions.color = color;
    this.onUpdateOptions.emit(this.datasetOptions);
  }

}
