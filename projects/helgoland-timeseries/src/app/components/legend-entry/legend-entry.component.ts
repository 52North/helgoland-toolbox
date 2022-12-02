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
    const message = `${this.translateSrvc.instant('events.remove-timeseries')} ${this.dataset.label}`;
    this.liveAnnouncer.announce(message);
  }
}
