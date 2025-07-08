import { Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HelgolandCoreModule, Parameter } from '@helgoland/core';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';
import {
  DatasetByStationSelectorComponent,
  SelectableDataset,
} from '@helgoland/selector';
import { TranslateModule } from '@ngx-translate/core';

import { AppRouterService } from '../../services/app-router.service';
import { DatasetsService } from '../../services/graph-datasets.service';
import { TimeseriesService } from './../../services/timeseries-service.service';

@Component({
  selector: 'helgoland-modal-dataset-by-station-selector',
  templateUrl: './modal-dataset-by-station-selector.component.html',
  styleUrls: ['./modal-dataset-by-station-selector.component.scss'],
  imports: [
    HelgolandCoreModule,
    HelgolandLabelMapperModule,
    MatBadgeModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatProgressBarModule,
    TranslateModule,
  ],
})
export class ModalDatasetByStationSelectorComponent extends DatasetByStationSelectorComponent {
  protected appRouter = inject(AppRouterService);
  protected graphDatasetsSrvc = inject(DatasetsService);
  protected timeseries = inject(TimeseriesService);

  protected override prepareResult(
    result: SelectableDataset,
    selection: boolean,
  ) {
    if (this.timeseries.hasDataset(result.internalId)) {
      selection = true;
    }
    super.prepareResult(result, selection);
  }

  public adjustSelection(change: MatSelectionListChange) {
    const id = (change.options[0].value as SelectableDataset).internalId;
    if (change.options[0].selected) {
      this.timeseries.addDataset(id);
    } else {
      this.timeseries.removeDataset(id);
    }
  }

  public getCategoryLabel(categories: Parameter[]) {
    return categories.map((e) => e.label).join(', ');
  }
}
