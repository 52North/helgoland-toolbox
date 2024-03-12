/* eslint-disable @angular-eslint/no-conflicting-lifecycle */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DoCheck,
  Input,
  IterableDiffer,
  IterableDiffers,
  KeyValueDiffers,
  OnChanges,
} from '@angular/core';
import {
  DatasetType,
  HelgolandServicesConnector,
  HelgolandTimeseries,
  StatusIntervalResolverService,
} from '@helgoland/core';
import { circleMarker, featureGroup, geoJSON, Layer, Map, Marker, marker } from 'leaflet';
import { forkJoin, Observable, Observer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { MapCache } from '../../base/map-cache.service';
import { MapSelectorComponent } from '../map-selector.component';
import { LastValueLabelGenerator, LastValuePresentation } from '../services/last-value-label-generator.interface';

/**
 * Displays selectable series with their last values on an map.
 */
@Component({
    selector: 'n52-last-value-map-selector',
    templateUrl: '../map-selector.component.html',
    styleUrls: ['../map-selector.component.scss'],
    standalone: true
})
export class LastValueMapSelectorComponent extends MapSelectorComponent<HelgolandTimeseries> implements AfterViewInit, DoCheck, OnChanges {

  /**
   * The list of internal series IDs, which should be presented with their last values on the map.
   */
  @Input()
  public lastValueSeriesIDs: string[] = [];

  /**
   * Presentation type how to display the series.
   */
  @Input()
  public lastValuePresentation: LastValuePresentation = LastValuePresentation.Colorized;

  /**
   * Ignores all Statusintervals where the timestamp is before a given duration in milliseconds and draws instead the default marker.
   */
  @Input()
  public ignoreStatusIntervalIfBeforeDuration = Infinity;

  private _lastValueSeriesIDsDiff: IterableDiffer<string>;

  private markerFeatureGroup: L.FeatureGroup<Marker> = featureGroup();

  constructor(
    protected override mapCache: MapCache,
    protected override kvDiffers: KeyValueDiffers,
    protected iDiffers: IterableDiffers,
    protected override cd: ChangeDetectorRef,
    protected servicesConnector: HelgolandServicesConnector,
    protected lastValueLabelGenerator: LastValueLabelGenerator,
    protected statusIntervalResolver: StatusIntervalResolverService
  ) {
    super(mapCache, kvDiffers, cd);
    this._lastValueSeriesIDsDiff = this.iDiffers.find(this.lastValueSeriesIDs).create();
  }

  public override ngDoCheck() {
    super.ngDoCheck();
    const changes = this._lastValueSeriesIDsDiff.diff(this.lastValueSeriesIDs);

    if (changes && this.map) {

      const ids: string[] = [];
      changes.forEachAddedItem(record => {
        ids.push(record.item);
      });
      this.createMarkersBySeriesIDs(ids, this.map);

      changes.forEachRemovedItem(record => {
        this.removeMarker(record.item);
      });
    }
  }

  protected drawGeometries(map: Map, serviceUrl: string): void {
    this.onContentLoading.emit(true);
    if (this.lastValueSeriesIDs && this.lastValueSeriesIDs.length) {
      this.createMarkersBySeriesIDs(this.lastValueSeriesIDs, map);
    }
  }

  private createMarkersBySeriesIDs(ids: string[], map: L.Map) {
    const obsList: Array<Observable<any>> = [];
    ids.forEach(id => {
      const tsObs = this.servicesConnector.getDataset(id, { type: DatasetType.Timeseries });
      obsList.push(tsObs.pipe(switchMap(val => this.createMarker(val).pipe(tap(res => {
        this.markerFeatureGroup.addLayer(res);
        res.on('click', () => this.onSelected.emit(val));
      })))));
    });
    this.finalizeMarkerObservables(obsList, map);
  }

  private createMarker(ts: HelgolandTimeseries): Observable<Layer> {
    switch (this.lastValuePresentation) {
      case LastValuePresentation.Colorized:
        return this.createColorizedMarker(ts);
      case LastValuePresentation.Textual:
        return this.createLabeledMarker(ts);
    }
    return this.createColorizedMarker(ts);
  }

  private finalizeMarkerObservables(obsList: Observable<any>[], map: L.Map) {
    forkJoin(obsList).subscribe(() => {
      const bounds = this.markerFeatureGroup.getBounds();
      this.zoomToMarkerBounds(bounds, map);
      map.invalidateSize();
      this.onContentLoading.emit(false);
    });
    this.markerFeatureGroup.addTo(map);
  }

  private createColorizedMarker(ts: HelgolandTimeseries): Observable<Layer> {
    return new Observable<Layer>((observer: Observer<Layer>) => {
      this.servicesConnector.getDatasetExtras(ts).subscribe(extras => {
        let coloredMarker: Layer | undefined = undefined;
        if (extras.statusIntervals) {
          if (ts.lastValue && (ts.lastValue.timestamp) > new Date().getTime() - this.ignoreStatusIntervalIfBeforeDuration) {
            const interval = this.statusIntervalResolver.getMatchingInterval(ts.lastValue.value, extras.statusIntervals);
            if (interval) {
              coloredMarker = this.createColoredMarker(ts, interval.color);
            }
          }
        }
        if (!coloredMarker) {
          coloredMarker = this.createDefaultColoredMarker(ts);
        }
        this.setId(coloredMarker, ts.internalId);
        observer.next(coloredMarker);
        observer.complete();
      });
    });
  }

  private createColoredMarker(ts: HelgolandTimeseries, color: string): Layer {
    return this.createFilledMarker(ts, color, 10);
  }

  private createDefaultColoredMarker(ts: HelgolandTimeseries): Layer {
    return this.createFilledMarker(ts, '#000', 10);
  }

  private createFilledMarker(ts: HelgolandTimeseries, color: string, radius: number): Layer {
    let geometry: Layer;
    if (ts.platform.geometry?.type === 'Point') {
      const point = ts.platform.geometry as GeoJSON.Point;
      geometry = circleMarker([point.coordinates[1], point.coordinates[0]], {
        color: '#000',
        fillColor: color,
        fillOpacity: 0.8,
        radius: 10,
        weight: 2
      });
    } else {
      geometry = geoJSON(ts.platform.geometry, {
        style: () => ({
          color: '#000',
          fillColor: color,
          fillOpacity: 0.8,
          weight: 2
        })
      });
    }
    if (geometry) {
      geometry.on('click', () => this.onSelected.emit(ts));
      return geometry;
    }
    throw new Error('Could not create geometry');
  }

  private createLabeledMarker(ts: HelgolandTimeseries): Observable<Marker> {
    return new Observable<Marker>(observer => {
      const icon = this.lastValueLabelGenerator.createIconLabel(ts);
      if (ts.platform.geometry?.type === 'Point') {
        const point = ts.platform.geometry as GeoJSON.Point;
        const genMarker = marker([point.coordinates[1], point.coordinates[0]], { icon });
        this.setId(genMarker, ts.internalId);
        observer.next(genMarker);
        observer.complete();
      }
    });
  }

  private setId(m: Layer, id: string) {
    if (m instanceof Marker) {
      // m.feature = {
      //   id,
      //   type: 'Feature',
      //   properties: null,
      //   geometry: null
      // };
    }
  }

  private removeMarker(markerId: string) {
    let searchedLayer;
    this.markerFeatureGroup.eachLayer((layer) => {
      if ((layer as Marker).feature?.id === markerId) {
        searchedLayer = layer;
      }
    });
    if (searchedLayer) {
      this.markerFeatureGroup.removeLayer(searchedLayer);
    }
  }

}
