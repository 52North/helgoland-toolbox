import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { TrajectoryEntryComponent } from '@helgoland/depiction';
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'helgoland-trajectories-legend-entry',
  templateUrl: './legend-entry.component.html',
  styleUrls: ['./legend-entry.component.scss'],
  imports: [
    ColorPickerModule,
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
})
export class LegendEntryComponent extends TrajectoryEntryComponent {
  confirmColor(color: string) {
    const datasetOptions = this.datasetOptions();
    if (datasetOptions) {
      datasetOptions.color = color;
      this.onUpdateOptions.emit(datasetOptions);
    }
  }
}
