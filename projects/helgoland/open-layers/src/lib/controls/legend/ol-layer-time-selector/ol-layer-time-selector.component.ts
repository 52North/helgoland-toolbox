import { Component, Input, OnInit } from '@angular/core';
import { Layer } from 'ol/layer';
import BaseLayer from 'ol/layer/Base';
import { TileWMS } from 'ol/source';

import { WmsCapabilitiesService } from '../../../services/wms-capabilities.service';

/**
 * Legend component to select time stamps of a layer, the time information is gathered by the WMS capabilities
 */
@Component({
  selector: 'n52-ol-layer-time-selector',
  templateUrl: './ol-layer-time-selector.component.html'
})
export class OlLayerTimeSelectorComponent implements OnInit {

  @Input() layer: BaseLayer;

  public currentTime: Date;

  public timeDimensions: Date[];

  public loading: boolean;

  protected layerSource: TileWMS;
  protected layerid: string;
  protected url: string;

  constructor(
    protected wmsCaps: WmsCapabilitiesService
  ) { }

  ngOnInit() {
    if (this.layer instanceof Layer) {
      const source = this.layer.getSource();
      if (source instanceof TileWMS) {
        this.loading = true;
        this.layerSource = source;
        this.url = source.getUrls()[0];
        this.layerid = source.getParams()['layers'] || source.getParams()['LAYERS'];
        this.wmsCaps.getTimeDimensionArray(this.layerid, this.url)
          .subscribe(
            res => this.timeDimensions = res,
            error => { },
            () => this.loading = false
          );
        this.determineCurrentTimeParameter();
      }
    }
  }

  public onSelect(time: Date) {
    this.setTime(time);
  }

  public compareFn(option1: Date, option2: Date) {
    return option1 && option2 && option1.getTime() === option2.getTime();
  }

  protected determineCurrentTimeParameter() {
    const currentTimeParam = this.layerSource.getParams()['time'] || this.layerSource.getParams()['Time'];
    if (currentTimeParam) {
      this.currentTime = new Date(currentTimeParam);
    } else {
      this.wmsCaps.getDefaultTimeDimension(this.layerid, this.url).subscribe(time => this.currentTime = time);
    }
  }

  protected setTime(time: Date) {
    this.currentTime = time;
    this.layerSource.updateParams({ time: time.toISOString() });
  }

}
