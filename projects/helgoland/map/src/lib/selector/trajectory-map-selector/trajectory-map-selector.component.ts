import 'leaflet.markercluster';

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  KeyValueDiffers,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  HelgolandDataset,
  HelgolandProfile,
  HelgolandProfileData,
  HelgolandServicesConnector,
  LocatedProfileDataEntry,
  Timespan,
} from '@helgoland/core';
import L from 'leaflet';

import { MapCache } from '../../base/map-cache.service';
import { MapSelectorComponent } from '../map-selector.component';
import { TrajectoryResult } from '../model/trajectory-result';

@Component({
  selector: 'n52-profile-trajectory-map-selector',
  templateUrl: '../map-selector.component.html',
  styleUrls: ['../map-selector.component.scss'],
  standalone: true,
})
export class ProfileTrajectoryMapSelectorComponent
  extends MapSelectorComponent<TrajectoryResult>
  implements OnChanges, AfterViewInit
{
  @Input({ required: true })
  public selectedTimespan!: Timespan;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onTimeListDetermined: EventEmitter<number[]> = new EventEmitter();

  private layer: L.FeatureGroup = this.initLayer();
  private data: LocatedProfileDataEntry[] = [];
  private dataset: HelgolandDataset | undefined;

  private defaultStyle: L.PathOptions = {
    color: 'red',
    weight: 5,
    opacity: 0.65,
  };

  private highlightStyle: L.PathOptions = {
    color: 'blue',
    weight: 7,
    opacity: 1,
  };

  constructor(
    protected servicesConnector: HelgolandServicesConnector,
    protected override mapCache: MapCache,
    protected override kvDiffers: KeyValueDiffers,
    protected override cd: ChangeDetectorRef,
  ) {
    super(mapCache, kvDiffers, cd);
  }

  public override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['selectedTimespan'] && this.selectedTimespan && this.map) {
      this.clearMap(this.map);
      this.data.forEach((entry) => {
        if (
          this.dataset &&
          this.selectedTimespan.from <= entry.timestamp &&
          entry.timestamp <= this.selectedTimespan.to
        ) {
          this.layer.addLayer(this.createGeoJson(entry, this.dataset));
        }
      });
      this.layer.addTo(this.map);
    }
  }

  protected drawGeometries(map: L.Map, serviceUrl: string): void {
    this.onContentLoading.emit(true);
    if (!serviceUrl || !map) {
      return;
    }
    this.servicesConnector
      .getDatasets(serviceUrl, { ...this.filter, expanded: true })
      .subscribe((datasets) => {
        datasets.forEach((dataset) => {
          if (
            dataset instanceof HelgolandProfile &&
            dataset.firstValue &&
            dataset.lastValue
          ) {
            this.dataset = dataset;
            const timespan = new Timespan(
              dataset.firstValue.timestamp,
              dataset.lastValue.timestamp,
            );
            this.servicesConnector
              .getDatasetData(dataset, timespan)
              .subscribe((data: HelgolandProfileData) => {
                if (data.values instanceof Array) {
                  this.initLayer();
                  this.data = [];
                  const timelist: number[] = [];
                  (data.values as LocatedProfileDataEntry[]).forEach(
                    (entry) => {
                      this.data.push(entry);
                      const geojson = this.createGeoJson(entry, dataset);
                      timelist.push(entry.timestamp);
                      this.layer.addLayer(geojson);
                    },
                  );
                  this.onTimeListDetermined.emit(timelist);
                  this.layer.addTo(map);
                  this.zoomToMarkerBounds(this.layer.getBounds(), map);
                }
                this.onContentLoading.emit(false);
              });
          }
        });
      });
  }

  private initLayer() {
    return L.markerClusterGroup({ animate: false });
  }

  private clearMap(map: L.Map) {
    if (map && this.layer) {
      map.removeLayer(this.layer);
    }
  }

  private createGeoJson(
    profileDataEntry: LocatedProfileDataEntry,
    dataset: HelgolandDataset,
  ): L.GeoJSON {
    const geojson = new L.GeoJSON(profileDataEntry.geometry);
    geojson.setStyle(this.defaultStyle);
    geojson.on('click', () => {
      this.onSelected.emit({
        dataset,
        data: profileDataEntry,
      });
    });
    geojson.on('mouseover', () => {
      geojson.setStyle(this.highlightStyle);
      geojson.bringToFront();
    });
    geojson.on('mouseout', () => {
      geojson.setStyle(this.defaultStyle);
    });
    return geojson;
  }
}
