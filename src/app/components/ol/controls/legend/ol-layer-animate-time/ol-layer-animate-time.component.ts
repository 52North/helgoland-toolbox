import { Component, Input, OnInit } from '@angular/core';
import BaseLayer from 'ol/layer/Base';
import Layer from 'ol/layer/Layer';
import { TileWMS } from 'ol/source';

import { WmsCapabilitiesService } from '../../../services/wms-capabilities.service';

@Component({
  selector: 'n52-ol-layer-animate-time',
  templateUrl: './ol-layer-animate-time.component.html',
  styleUrls: ['./ol-layer-animate-time.component.css']
})
export class OlLayerAnimateTimeComponent implements OnInit {

  @Input() layer: BaseLayer;

  public timeDimensions: Date[];

  public currentTime: Date;

  private layerid: string;
  private url: string;
  private layerSource: TileWMS;
  private interval: NodeJS.Timeout;

  constructor(
    private wmsCaps: WmsCapabilitiesService
  ) { }

  ngOnInit() {
    if (this.layer instanceof Layer) {
      const source = this.layer.getSource();
      if (source instanceof TileWMS) {
        this.layerSource = source;
        this.url = source.getUrls()[0];
        this.layerid = source.getParams()['layers'] || source.getParams()['LAYERS'];
        this.wmsCaps.getTimeDimensionArray(this.layerid, this.url).subscribe(res => {
          this.timeDimensions = res;
        });
        this.determineCurrentTimeParameter();
      }
    }
  }

  public startAnimation() {
    // get current time parameter
    this.determineCurrentTimeParameter();
    // find index in list
    let idx = this.timeDimensions.findIndex(e => e.getTime() === this.currentTime.getTime());
    // start animation
    this.interval = setInterval(() => {
      idx++;
      if (idx >= this.timeDimensions.length) { idx = 0; }
      this.setTime(this.timeDimensions[idx]);
    }, 5000);
  }

  private determineCurrentTimeParameter() {
    const currentTimeParam = this.layerSource.getParams()['time'] || this.layerSource.getParams()['Time'];
    if (currentTimeParam) {
      this.currentTime = new Date(currentTimeParam);
    } else {
      this.wmsCaps.getDefaultTimeDimension(this.layerid, this.url).subscribe(time => this.currentTime = time);
    }
  }

  public stopAnimation() {
    clearInterval(this.interval);
  }

  public resetAnimation() {
    this.wmsCaps.getDefaultTimeDimension(this.layerid, this.url).subscribe(time => this.setTime(time));
  }

  private setTime(time: Date) {
    this.currentTime = time;
    this.layerSource.updateParams({ time: time.toISOString() });
  }

}
