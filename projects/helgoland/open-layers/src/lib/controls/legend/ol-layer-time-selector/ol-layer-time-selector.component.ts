import { Component, OnInit, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TzDatePipe } from '@helgoland/core';
import BaseLayer from 'ol/layer/Base';
import Layer from 'ol/layer/Layer';
import { TileWMS } from 'ol/source';

import { WmsCapabilitiesService } from '../../../services/wms-capabilities.service';

/**
 * Legend component to select time stamps of a layer, the time information is gathered by the WMS capabilities
 */
@Component({
  selector: 'n52-ol-layer-time-selector',
  templateUrl: './ol-layer-time-selector.component.html',
  imports: [FormsModule, TzDatePipe],
})
export class OlLayerTimeSelectorComponent implements OnInit {
  protected wmsCaps = inject(WmsCapabilitiesService);

  readonly layer = input.required<BaseLayer>();

  currentTime: Date | undefined;

  timeDimensions: Date[] | undefined;

  loading: boolean | undefined;

  protected layerSource: TileWMS | undefined;
  protected layerid: string | undefined;
  protected url: string | undefined;

  ngOnInit() {
    const layer = this.layer();
    if (layer instanceof Layer) {
      const source = layer.getSource();
      if (source instanceof TileWMS && source.getUrls()?.length) {
        this.loading = true;
        this.layerSource = source;
        this.url = source.getUrls()![0];
        this.layerid =
          source.getParams()['layers'] || source.getParams()['LAYERS'];
        if (this.layerid) {
          this.wmsCaps.getTimeDimensionArray(this.layerid, this.url).subscribe({
            next: (res) => (this.timeDimensions = res),
            error: (error) => {},
            complete: () => (this.loading = false),
          });
        }
        this.determineCurrentTimeParameter();
      }
    }
  }

  onSelect(time: Date) {
    this.setTime(time);
  }

  compareFn(option1: Date, option2: Date) {
    return option1 && option2 && option1.getTime() === option2.getTime();
  }

  protected determineCurrentTimeParameter() {
    if (this.layerSource && this.layerid && this.url) {
      const currentTimeParam =
        this.layerSource.getParams()['time'] ||
        this.layerSource.getParams()['Time'];
      if (currentTimeParam) {
        this.currentTime = new Date(currentTimeParam);
      } else {
        this.wmsCaps.getDefaultTimeDimension(this.layerid, this.url).subscribe({
          next: (time) => (this.currentTime = time),
          error: (err) => console.error(err),
        });
      }
    }
  }

  protected setTime(time: Date) {
    if (this.layerSource) {
      this.currentTime = time;
      this.layerSource.updateParams({ time: time.toISOString() });
    }
  }
}
