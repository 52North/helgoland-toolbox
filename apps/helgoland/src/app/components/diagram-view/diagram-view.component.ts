import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColorService, DatasetOptions, Time, Timespan } from '@helgoland/core';
import { D3PlotOptions, HoveringStyle } from '@helgoland/d3';
import moment from 'moment';

import { DiagramConfig, ModalDiagramSettingsComponent } from './../modal-diagram-settings/modal-diagram-settings.component';

@Component({
  selector: 'helgoland-toolbox-diagram-view',
  templateUrl: './diagram-view.component.html',
  styleUrls: ['./diagram-view.component.scss']
})
export class DiagramViewComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  public datasetIds = [
    'https://www.fluggs.de/sos2/api/v1/__26',
  ];

  public selectedIds: string[] = [];

  public datasetOptions: Map<string, DatasetOptions> = new Map();

  public timespan;

  public d3diagramOptions: D3PlotOptions = {
    showReferenceValues: true,
    togglePanZoom: true,
    generalizeAllways: false,
    yaxis: true, // configurable
    showTimeLabel: false,
    hoverStyle: HoveringStyle.none,
    copyright: {
      label: 'This should be bottom right and the text is long.',
      link: 'https://52north.org/',
      positionX: 'right',
      positionY: 'bottom'
    },
    groupYaxis: true
  };

  public d3overviewOptions: D3PlotOptions = {
    overview: true,
    showTimeLabel: false
  };

  public diagramLoading: boolean;
  public overviewLoading: boolean;

  public diagramConfig: DiagramConfig = {
    overviewVisible: true,
    yaxisVisible: true,
    yaxisModifier: true,
    hoverstyle: 'none'
  };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private dialog: MatDialog,
    private timeSrvc: Time,
    private color: ColorService,
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.timespan = this.timeSrvc.createByDurationWithEnd(moment.duration(7, 'days'), new Date(), 'day');

    this.datasetIds.forEach((entry) => {
      const option = new DatasetOptions(entry, this.color.getColor());
      option.generalize = true;
      option.lineWidth = 2;
      option.pointRadius = 4;
      this.datasetOptions.set(entry, option);
    });
  }

  public timespanChanged(timespan: Timespan) {
    this.timespan = timespan;
  }

  public setSelected(selectedIds: string[]) {
    this.selectedIds = selectedIds;
  }

  public onDiagramLoading(loading: boolean) {
    this.diagramLoading = loading;
  }

  public onOverviewLoading(loading: boolean) {
    this.overviewLoading = loading;
  }

  public openDiagramSettings() {
    const dialogRef = this.dialog.open(ModalDiagramSettingsComponent, {
      data: {
        overviewVisible: this.diagramConfig.overviewVisible,
        yaxisVisible: this.diagramConfig.yaxisVisible,
        yaxisModifier: this.diagramConfig.yaxisModifier,
        hoverstyle: this.diagramConfig.hoverstyle
      } as DiagramConfig
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.diagramConfig = result;
        this.d3diagramOptions.hoverStyle = HoveringStyle[this.diagramConfig.hoverstyle];
        this.d3diagramOptions.yaxis = this.diagramConfig.yaxisVisible;
      }
    })
  }

}
