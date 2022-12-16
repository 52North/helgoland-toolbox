import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColorService, HelgolandServicesConnector, InternalIdHandler, Time } from '@helgoland/core';
import {
  HelgolandDatasetlistModule,
  HelgolandLabelMapperModule,
  ReferenceValueColorCache,
  TimeseriesEntryComponent,
} from '@helgoland/depiction';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingOverlayProgressBarComponent } from 'helgoland-common';

import { FavoriteToggleButtonComponent } from '../favorites/favorite-toggle-button/favorite-toggle-button.component';
import { TimeseriesEntrySymbolComponent } from './timeseries-entry-symbol/timeseries-entry-symbol.component';

@Component({
  selector: 'helgoland-legend-entry',
  templateUrl: './legend-entry.component.html',
  styleUrls: ['./legend-entry.component.scss'],
  imports: [
    CommonModule,
    FavoriteToggleButtonComponent,
    HelgolandDatasetlistModule,
    HelgolandLabelMapperModule,
    LoadingOverlayProgressBarComponent,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    TimeseriesEntrySymbolComponent,
    TranslateModule,
  ],
  standalone: true
})
export class LegendEntryComponent extends TimeseriesEntryComponent {

  constructor(
    protected override servicesConnector: HelgolandServicesConnector,
    protected override timeSrvc: Time,
    protected override internalIdHandler: InternalIdHandler,
    protected override color: ColorService,
    protected override refValCache: ReferenceValueColorCache,
    protected liveAnnouncer: LiveAnnouncer,
    public override translateSrvc: TranslateService,
  ) {
    super(servicesConnector, timeSrvc, internalIdHandler, color, refValCache, translateSrvc);
  }

  override removeDataset() {
    super.removeDataset();
    const message = `${this.translateSrvc.instant('events.remove-timeseries')} ${this.dataset!.label}`;
    this.liveAnnouncer.announce(message);
  }
}
