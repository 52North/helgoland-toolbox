import { Component, EventEmitter, Host, Input, Output } from '@angular/core';
import { HelgolandParameterFilter, HelgolandPlatform, HelgolandServicesConnector, Required } from '@helgoland/core';
import { Feature, Map } from 'ol';
import { unlistenByKey } from 'ol/events';
import { click, pointerMove } from 'ol/events/condition';
import { extend } from 'ol/extent';
import { FeatureLike } from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Select } from 'ol/interaction.js';
import VectorLayer from 'ol/layer/Vector';
import { Cluster } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { Circle, Fill, Stroke, Style, Text } from 'ol/style';

import { OlBaseComponent } from '../../ol-base.component';
import { OlMapService } from '../../services/map.service';
import { OlMapId } from '../../services/mapid.service';

/**
 * Component to display station based on the input parameters. The component must be embedded as seen in the example:
 *
 * @example
 * <n52-ol-map>
 *     <n52-ol-station-selector-layer [serviceUrl]="serviceUrl" [filter]="filter"></n52-ol-station-selector-layer>
 * </n52-ol-map>
 */
@Component({
  selector: 'n52-ol-station-selector-layer',
  template: '',
})
export class OlStationSelectorLayerComponent extends OlBaseComponent {

  /**
   * The serviceUrl, where the selection should be loaded.
   */
  @Required @Input() public serviceUrl: string;

  /**
   * The filter which should be used, while fetching the selection.
   */
  @Input() public filter: HelgolandParameterFilter;

  /**
   * Zoom to the stations after collected and displayed
   */
  @Input() public zoomToResult = true;

  /**
   * Cluster stations
   */
  @Input() public cluster = true;

  /**
   * Inform, when a station is selected
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onSelected: EventEmitter<HelgolandPlatform> = new EventEmitter<HelgolandPlatform>();

  /**
   * Inform, while stations are loaded
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onContentLoading: EventEmitter<boolean> = new EventEmitter();

  /**
   * Inform, when no stations are found
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onNoResultsFound: EventEmitter<boolean> = new EventEmitter();

  private map: Map;

  private layer: VectorLayer;

  constructor(
    protected override mapService: OlMapService,
    @Host() protected override mapidService: OlMapId,
    protected servicesConnector: HelgolandServicesConnector,
  ) {
    super(mapService, mapidService);
  }

  mapInitialized(map: Map) {
    this.map = map;
    this.drawGeometries();
  }

  private drawGeometries() {
    // TODO: on filter changes
    // TODO: draw marker for results
    this.createStationGeometries();
  }

  private createStationGeometries() {
    this.servicesConnector.getPlatforms(this.serviceUrl, this.filter)
      .subscribe((stations) => {
        const features: Feature[] = this.createFeatureList(stations);

        this.createLayer(features);

        this.createHoverInteraction();

        this.createClickInteraction();

        if (this.zoomToResult) {
          this.zoomToFeatures(features);
        }
      });
  }

  private createLayer(features: Feature[]) {
    if (this.cluster) {
      this.layer = new VectorLayer({
        source: new Cluster({
          distance: 100,
          source: new VectorSource({
            features
          })
        }),
        style: feature => this.styleClusterLayer(feature)
      });
    } else {
      this.layer = new VectorLayer({
        source: new VectorSource({
          features
        }),
        style: () => this.createMarkerStyle(),
      });
    }
    this.map.addLayer(this.layer);
  }

  private createFeatureList(stations: HelgolandPlatform[]) {
    const features: Feature[] = [];
    stations.forEach(st => {
      // TODO: add to service
      if (st.geometry.type === 'Point') {
        const point = new Point(st.geometry.coordinates);
        point.transform('EPSG:4326', this.map.getView().getProjection());
        const feature = new Feature(point);
        feature.set('station', st, true);
        features.push(feature);
      }
    });
    return features;
  }

  private createHoverInteraction() {
    if (this.cluster) {
      const hoverSelect = new Select({
        condition: pointerMove,
        style: feature => this.styleClusterLayer(feature),
        layers: [this.layer]
      });

      hoverSelect.on('select', (evt => {
        if (evt.selected.length >= 1) {
          const temp = hoverSelect.getFeatures().on('remove', () => {
            unlistenByKey(temp);
          });
        }
      }));
      this.map.addInteraction(hoverSelect);
    }
  }

  private createClickInteraction() {
    const clickSelect = new Select({
      condition: click,
      style: feature => this.cluster ? this.styleClusterLayer(feature) : this.createMarkerStyle(),
      layers: [this.layer]
    });
    clickSelect.on('select', (evt => {
      if (evt.selected.length >= 1) {
        if (evt.selected[0].getProperties()['station']) {
          this.onSelected.emit(evt.selected[0].getProperties()['station']);
        } else {
          const selectedFeatures = evt.selected[0].getProperties()['features'];
          if (selectedFeatures.length > 1) {
            clickSelect.getFeatures().clear();
            setTimeout(() => {
              this.zoomToFeatures(selectedFeatures);
            }, 10);
          } else if (selectedFeatures.length === 1) {
            this.onSelected.emit(selectedFeatures[0].getProperties().station);
          }
        }
      }
    }));
    this.map.addInteraction(clickSelect);
  }

  private styleClusterLayer(feature: FeatureLike): Style | Style[] {
    const size = feature.get('features').length;
    if (size > 1) {
      return this.createClusterStyle(size);
    } else {
      return this.createMarkerStyle();
    }
  }

  private createClusterStyle(size: number) {
    const color = size > 25 ? '248, 128, 0' : size > 8 ? '248, 192, 0' : '128, 192, 64';
    const radius = Math.max(8, Math.min(size * 0.75, 20));
    return [
      new Style({
        image: new Circle({
          radius: radius + 2,
          stroke: new Stroke({
            color: 'rgba(' + color + ',0.3)',
            width: 4
          })
        })
      }),
      new Style({
        image: new Circle({
          radius: radius,
          fill: new Fill({
            color: 'rgba(' + color + ',0.6)'
          })
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({
            color: '#000'
          })
        })
      })
    ];
  }

  private zoomToFeatures(features: Feature[]) {
    if (features.length > 0) {
      const extent = features[0].getGeometry().getExtent().slice(0);
      features.forEach(f => extend(extent, f.getGeometry().getExtent()));
      this.map.getView().fit(extent, { duration: 300 });
    }
  }

  private createMarkerStyle(): Style {
    return new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({
          color: 'blue',
        })
      })
    });
  }
}
