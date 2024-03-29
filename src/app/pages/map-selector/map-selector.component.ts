import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  HelgolandParameterFilter,
  HelgolandPlatform,
  Phenomenon,
  Timeseries,
} from '@helgoland/core';
import {
  GeoSearchOptions,
  HelgolandMapControlModule,
  HelgolandMapSelectorModule,
  LastValuePresentation,
  LayerMap,
  MapCache,
  MarkerSelectorGenerator,
} from '@helgoland/map';
import { HelgolandSelectorModule } from '@helgoland/selector';
import {
  CircleMarker,
  circleMarker,
  FitBoundsOptions,
  geoJSON,
  icon,
  Layer,
  Marker,
  tileLayer,
  WMSOptions,
} from 'leaflet';

Marker.prototype.options.icon = icon({
  iconRetinaUrl: 'assets/img/marker-icon-2x.png',
  iconUrl: 'assets/img/marker-icon.png',
  shadowUrl: 'assets/img/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

class MarkerSelectorGeneratorImpl implements MarkerSelectorGenerator {
  constructor(
    private mapCache: MapCache,
    private mapId: string,
  ) {}

  public createFilledMarker(station: HelgolandPlatform, color: string): Layer {
    let geometry: Layer;
    if (station.geometry?.type === 'Point') {
      const point = station.geometry as GeoJSON.Point;
      geometry = circleMarker([point.coordinates[1], point.coordinates[0]], {
        color: '#000',
        fillColor: color,
        fillOpacity: 0.8,
        radius: this.calculateRadius(),
        weight: 2,
      });
      this.mapCache.getMap(this.mapId).on('zoomend', () => {
        (geometry as CircleMarker).setRadius(this.calculateRadius());
      });
    } else {
      geometry = geoJSON(station.geometry, {
        style: (feature) => {
          return {
            color: '#000',
            fillColor: color,
            fillOpacity: 0.8,
            weight: 2,
          };
        },
      });
    }
    return geometry;
  }

  public createDefaultFilledMarker(station: HelgolandPlatform): Layer {
    return this.createFilledMarker(station, '#fff');
  }

  public createDefaultGeometry(station: HelgolandPlatform): Layer {
    return this.createFilledMarker(station, '#ff0000');
  }

  private calculateRadius(): number {
    const currentZoom = this.mapCache.getMap(this.mapId).getZoom();
    if (currentZoom <= 7) {
      return 6;
    }
    return currentZoom;
  }
}

@Component({
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.css'],
  imports: [
    HelgolandSelectorModule,
    CommonModule,
    HelgolandMapSelectorModule,
    HelgolandMapControlModule,
  ],
  standalone: true,
})
export class MapSelectorComponent {
  public providerUrl = 'https://geo.irceline.be/sos/api/v1/';
  // public providerUrl = 'http://mudak-wrm.dev.52north.org/sos/api/';

  public fitBounds: L.LatLngBoundsExpression = [
    [49.5, 3.27],
    [51.5, 5.67],
  ];
  public fitBounds2: L.LatLngBoundsExpression = [
    [49.5, 3.27],
    [51.5, 5.67],
  ];
  public zoomControlOptions: L.Control.ZoomOptions = { position: 'topleft' };
  public avoidZoomToSelection = false;
  public baseMaps: LayerMap = new Map();
  public overlayMaps: LayerMap = new Map();
  public layerControlOptions: L.Control.LayersOptions = {
    position: 'bottomleft',
  };
  public cluster = false;
  public loadingStations: boolean = false;
  public stationFilter: HelgolandParameterFilter = {
    // phenomenon: '8'
  };
  public statusIntervals = false;
  public mapOptions: L.MapOptions = { dragging: true, zoomControl: false };
  public searchOptions: GeoSearchOptions = { countrycodes: [] };
  public markerSelectorGenerator: MarkerSelectorGenerator;
  public mapId = 'mapid';

  constructor(private mapCache: MapCache) {
    this.markerSelectorGenerator = new MarkerSelectorGeneratorImpl(
      this.mapCache,
      this.mapId,
    );

    setTimeout(() => {
      this.lastValueSeriesIDs.push(
        'https://fluggs.wupperverband.de/sws5/api/__54',
      );
    }, 2000);
  }

  public lastValueSeriesIDs = [
    'https://fluggs.wupperverband.de/sws5/api/__51',
    'https://fluggs.wupperverband.de/sws5/api/__78',
    'https://fluggs.wupperverband.de/sws5/api/__95',
  ];
  public lastValuePresentation = LastValuePresentation.Textual;
  public fitBoundsMarkerOptions: FitBoundsOptions = { padding: [20, 20] };

  public addOverlayMapLayer() {
    this.overlayMaps = new Map();
    this.overlayMaps.set('pm10_24hmean_1x1', {
      label: 'pm10_24hmean_1x1',
      visible: true,
      layer: tileLayer.wms('http://geo.irceline.be/rio/wms', {
        layers: 'pm10_hmean_1x1',
        transparent: true,
        format: 'image/png',
        time: '2018-01-05T11:00:00.000Z',
        opacity: 0.7,
        tiled: true,
        visibility: true,
        pane: 'tilePane',
        zIndex: -9998,
        projection: 'EPSG:4326',
        units: 'm',
      } as WMSOptions),
    });
    this.overlayMaps.set('realtime:o3_station_max', {
      label: 'realtime:o3_station_max',
      visible: true,
      layer: tileLayer.wms('http://geo.irceline.be/wms', {
        layers: 'realtime:o3_station_max',
        transparent: true,
        format: 'image/png',
        time: '2018-01-05T11:00:00.000Z',
        visibility: false,
        pane: 'tilePane',
        zIndex: -9997,
        projection: 'EPSG:4326',
        units: 'm',
      } as WMSOptions),
    });
  }

  public removeOverlayMapLayer() {
    this.overlayMaps = new Map();
  }

  public showZoomControlsRight() {
    this.zoomControlOptions = { position: 'topright' };
  }

  public showZoomControlsLeft() {
    this.zoomControlOptions = { position: 'topleft' };
  }

  public switchProvider() {
    if (this.providerUrl === 'https://geo.irceline.be/sos/api/v1/') {
      this.providerUrl =
        'http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/';
    } else {
      this.providerUrl = 'https://geo.irceline.be/sos/api/v1/';
    }
  }

  public zoomToOtherExtend() {
    this.fitBounds = [
      [39.5, 3.27],
      [41.5, 5.67],
    ];
  }

  public onStationSelected(station: HelgolandPlatform) {
    console.log('Clicked station: ' + station.label);
  }

  public onSelectPhenomenon(phenomenon: Phenomenon) {
    console.log('Select: ' + phenomenon.label + ' with ID: ' + phenomenon.id);
    this.stationFilter = {
      phenomenon: phenomenon.id,
    };
  }

  public timeseriesSelected(ts: Timeseries) {
    alert(`Clicked ${ts.label}`);
  }
}
