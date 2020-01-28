import { Component, OnInit } from '@angular/core';
import { HelgolandPlatform } from '@helgoland/core';
import { OlMapService } from '@helgoland/open-layers';
import { Layer } from 'ol/layer';
import BaseLayer from 'ol/layer/Base';
import TileLayer from 'ol/layer/Tile';
import { OSM, TileWMS } from 'ol/source';

@Component({
  selector: 'n52-ol',
  templateUrl: './ol.component.html',
  styleUrls: ['./ol.component.scss']
})
export class OlComponent implements OnInit {

  public layers: BaseLayer[] = [];

  public overviewMapLayers: Layer[] = [new TileLayer({ source: new OSM() })];

  public mapId = 'test-map';

  constructor(
    private mapService: OlMapService
  ) { }

  ngOnInit() {

    this.layers.push(new TileLayer({
      visible: true,
      source: new TileWMS({
        url: 'https://maps.dwd.de/geoserver/ows',
        params: {
          'LAYERS': 'dwd:RX-Produkt',
        }
      })
    }));

    this.layers.push(new TileLayer({
      visible: false,
      source: new TileWMS({
        url: 'https://maps.dwd.de/geoserver/ows',
        params: {
          'LAYERS': 'dwd:FX-Produkt',
        }
      })
    }));

    // this.layers.push(new TileLayer({
    //   visible: false,
    //   source: new TileWMS({
    //     url: 'https://maps.dwd.de/geoserver/ows',
    //     params: {
    //       'LAYERS': 'dwd:Warngebiete_Binnenseen',
    //     }
    //   })
    // }));

    // this.layers.push(new TileLayer({
    //   visible: false,
    //   source: new TileWMS({
    //     url: 'https://maps.dwd.de/geoserver/ows',
    //     params: {
    //       'LAYERS': 'dwd:Pollenflug_Birke',
    //     }
    //   })
    // }));

    // this.layers.push(new TileLayer({
    //   visible: false,
    //   source: new TileWMS({
    //     url: 'https://maps.dwd.de/geoserver/ows',
    //     params: {
    //       'LAYERS': 'dwd:icon_t_2m',
    //     }
    //   })
    // }));

  }

  public getLegendUrl(legendUrl: string) {
    alert(legendUrl);
    console.log(legendUrl);
  }

  public removeLayer(i: number) {
    const layer = this.layers.splice(i, 1);
    this.mapService.getMap(this.mapId).subscribe(map => map.removeLayer(layer[0]));
  }

  public stationSelected(station: HelgolandPlatform) {
    alert(station.label);
    console.log(station);
  }

}
