import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { ColorService, HelgolandServicesConnector, InternalIdHandler, Time } from '@helgoland/core';
import { ReferenceValueColorCache, TimeseriesEntryComponent } from '@helgoland/depiction';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'helgoland-legend-entry',
  templateUrl: './legend-entry.component.html',
  styleUrls: ['./legend-entry.component.scss']
})
export class LegendEntryComponent extends TimeseriesEntryComponent {

  constructor(
    protected servicesConnector: HelgolandServicesConnector,
    protected timeSrvc: Time,
    protected internalIdHandler: InternalIdHandler,
    protected color: ColorService,
    protected refValCache: ReferenceValueColorCache,
    protected liveAnnouncer: LiveAnnouncer,
    public translateSrvc: TranslateService,
  ) {
    super(servicesConnector, timeSrvc, internalIdHandler, color, refValCache, translateSrvc);
  }

  removeDataset() {
    super.removeDataset();
    const message = `${this.translateSrvc.instant('events.remove-timeseries')} ${this.dataset.label}`;
    this.liveAnnouncer.announce(message);
  }
}
