import { MediaMatcher } from '@angular/cdk/layout';

import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Time } from '@helgoland/core';
import {
  D3SeriesGraphOptions,
  DatasetStyle,
  HelgolandD3Module,
  HoveringStyle,
  SeriesGraphDataset,
} from '@helgoland/d3';
import { TranslateModule } from '@ngx-translate/core';
import {
  LoadingOverlayProgressBarComponent,
  ShareButtonComponent,
} from 'helgoland-common';

import { DataTableComponent } from '../../components/data-table/data-table.component';
import { DatasetLegendEntryComponent } from '../../components/dataset-legend-entry/dataset-legend-entry.component';
import { ModalFavoriteListButtonComponent } from '../../components/favorites/modal-favorite-list-button/modal-favorite-list-button.component';
import {
  DiagramConfig,
  ModalDiagramSettingsComponent,
} from '../../components/modal-diagram-settings/modal-diagram-settings.component';
import { GeneralTimeSelectionComponent } from '../../components/time/general-time-selection/general-time-selection.component';
import {
  AppConfig,
  ConfigurationService,
} from '../../services/configuration.service';
import { ModalMainConfigButtonComponent } from './../../components/main-config/modal-main-config-button/modal-main-config-button.component';
import { AppRouterService } from './../../services/app-router.service';
import {
  DatasetsService,
  LoadingDataset,
} from './../../services/graph-datasets.service';
import { DiagramViewInitStateService } from './diagram-view-permalink.service';

type MainContentType = 'diagram' | 'table';
@Component({
  selector: 'helgoland-diagram-view',
  templateUrl: './diagram-view.component.html',
  styleUrls: ['./diagram-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    DatasetLegendEntryComponent,
    GeneralTimeSelectionComponent,
    HelgolandD3Module,
    LoadingOverlayProgressBarComponent,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    ModalFavoriteListButtonComponent,
    ModalMainConfigButtonComponent,
    ShareButtonComponent,
    TranslateModule,
    DataTableComponent,
  ],
})
export class DiagramViewComponent implements OnInit {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private media = inject(MediaMatcher);
  private dialog = inject(MatDialog);
  protected appRouter = inject(AppRouterService);
  protected initStateService = inject(DiagramViewInitStateService);
  private time = inject(Time);
  protected graphDatasetsSrvc = inject(DatasetsService);
  private configSrvc = inject(
    ConfigurationService<AppConfig>,
  ) as ConfigurationService<AppConfig>;

  mobileQuery: MediaQueryList;

  // private _mobileQueryListener: () => void;

  diagramConfig: DiagramConfig = {
    overviewVisible: true,
    yaxisVisible: true,
    yaxisModifier: true,
    hoverstyle: HoveringStyle.point,
  };

  graphOptions: D3SeriesGraphOptions = {
    showTimeLabel: false,
    hoverStyle: this.diagramConfig.hoverstyle,
    togglePanZoom: true,
    yaxisModifier: this.diagramConfig.yaxisModifier,
  };

  overviewOptions: D3SeriesGraphOptions = {
    showTimeLabel: false,
    yaxis: false,
    hoverStyle: HoveringStyle.none,
    overview: true,
  };

  mainContentType: MainContentType = 'diagram';
  dataTableVisible = this.configSrvc.getSettings().dataTableVisible || false;
  dataLoading: boolean = false;
  overviewLoading: boolean = false;

  constructor() {
    this.mobileQuery = this.media.matchMedia('(max-width: 1024px)');
    // this._mobileQueryListener = () => {
    //   debugger;
    //   return this.changeDetectorRef.detectChanges();
    // };
    // this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  // ngOnDestroy(): void {
  //   this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  // }

  ngOnInit(): void {
    this.initStateService.preloadDatasets().subscribe((loadDs) => {
      if (!loadDs) {
        this.openMapSelection();
      }
    });

    this.graphDatasetsSrvc.loadingDataChanged.subscribe(
      (ld) => (this.dataLoading = ld.size > 0),
    );

    this.graphDatasetsSrvc.loadingOverviewDataChanged.subscribe(
      (ld) => (this.overviewLoading = ld.size > 0),
    );
    // this.timeseries.datasetIdsChanged.subscribe(list => this.setDatasets());
    //   this.setDatasets();

    //   if (!this.timeseries.hasDatasets()) {
    //     this.openMapSelection();
    //   }
    // }

    // private setDatasets() {
    //   this.datasetIds = this.timeseries.datasetIds;
    //   this.datasetOptions = this.timeseries.datasetOptions;
    // }

    // setSelected(selectedIds: string[]) {
    //   this.selectedIds = selectedIds;
  }

  isLoading(
    dataset: SeriesGraphDataset<DatasetStyle> | LoadingDataset,
  ): dataset is LoadingDataset {
    return dataset instanceof LoadingDataset;
  }

  openDiagramSettings() {
    const dialogRef = this.dialog.open(ModalDiagramSettingsComponent, {
      data: {
        overviewVisible: this.diagramConfig.overviewVisible,
        yaxisVisible: this.diagramConfig.yaxisVisible,
        yaxisModifier: this.diagramConfig.yaxisModifier,
        hoverstyle: this.diagramConfig.hoverstyle,
      } as DiagramConfig,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.diagramConfig = result;
        this.graphOptions.hoverStyle =
          HoveringStyle[this.diagramConfig.hoverstyle];
        this.graphOptions.yaxis = this.diagramConfig.yaxisVisible;
        this.graphOptions.yaxisModifier = this.diagramConfig.yaxisModifier;
      }
    });
  }

  jumpToDate(date: Date) {
    this.graphDatasetsSrvc.timespan = this.time.centerTimespan(
      this.graphDatasetsSrvc.timespan!,
      date,
    );
  }

  openMapSelection() {
    this.appRouter.toMapSelection();
  }

  openListSelection() {
    this.appRouter.toListSelection();
  }
}
