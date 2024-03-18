import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Time } from '@helgoland/core';
import {
  D3SeriesGraphOptions,
  HelgolandD3Module,
  HoveringStyle,
} from '@helgoland/d3';
import { TranslateModule } from '@ngx-translate/core';
import {
  LoadingOverlayProgressBarComponent,
  ShareButtonComponent,
} from 'helgoland-common';

import { DatasetLegendEntryComponent } from '../../components/dataset-legend-entry/dataset-legend-entry.component';
import { ModalFavoriteListButtonComponent } from '../../components/favorites/modal-favorite-list-button/modal-favorite-list-button.component';
import {
  DiagramConfig,
  ModalDiagramSettingsComponent,
} from '../../components/modal-diagram-settings/modal-diagram-settings.component';
import { GeneralTimeSelectionComponent } from '../../components/time/general-time-selection/general-time-selection.component';
import { ModalMainConfigButtonComponent } from './../../components/main-config/modal-main-config-button/modal-main-config-button.component';
import { AppRouterService } from './../../services/app-router.service';
import { DatasetsService } from './../../services/graph-datasets.service';
import { DiagramViewInitStateService } from './diagram-view-permalink.service';

@Component({
  selector: 'helgoland-diagram-view',
  templateUrl: './diagram-view.component.html',
  styleUrls: ['./diagram-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    DatasetLegendEntryComponent,
    GeneralTimeSelectionComponent,
    HelgolandD3Module,
    LoadingOverlayProgressBarComponent,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    ModalFavoriteListButtonComponent,
    ModalMainConfigButtonComponent,
    ShareButtonComponent,
    TranslateModule,
  ],
  standalone: true,
})
export class DiagramViewComponent implements OnInit {
  mobileQuery: MediaQueryList;

  // private _mobileQueryListener: () => void;

  public diagramConfig: DiagramConfig = {
    overviewVisible: true,
    yaxisVisible: true,
    yaxisModifier: true,
    hoverstyle: HoveringStyle.point,
  };

  public graphOptions: D3SeriesGraphOptions = {
    showTimeLabel: false,
    hoverStyle: this.diagramConfig.hoverstyle,
    togglePanZoom: true,
    yaxisModifier: this.diagramConfig.yaxisModifier,
  };

  public overviewOptions: D3SeriesGraphOptions = {
    showTimeLabel: false,
    yaxis: false,
    hoverStyle: HoveringStyle.none,
    overview: true,
  };

  diagramLoading: boolean = false;
  overviewLoading: boolean = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private dialog: MatDialog,
    public appRouter: AppRouterService,
    public initStateService: DiagramViewInitStateService,
    private time: Time,
    public graphDatasetsSrvc: DatasetsService,
  ) {
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
    // TODO: fix initalization
    this.initStateService.preloadDatasets().subscribe((loadDs) => {
      if (!loadDs) {
        this.openMapSelection();
      }
    });
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

    // public setSelected(selectedIds: string[]) {
    //   this.selectedIds = selectedIds;
  }

  onDiagramLoading(loading: boolean) {
    setTimeout(() => (this.diagramLoading = loading));
  }

  onOverviewLoading(loading: boolean) {
    setTimeout(() => (this.overviewLoading = loading));
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

  public jumpToDate(date: Date) {
    this.graphDatasetsSrvc.timespan = this.time.centerTimespan(
      this.graphDatasetsSrvc.timespan,
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
