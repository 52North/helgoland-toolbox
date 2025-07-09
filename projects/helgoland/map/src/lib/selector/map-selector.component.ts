import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  OnChanges,
  SimpleChanges,
  inject,
  output,
  input,
} from '@angular/core';
import { HelgolandParameterFilter } from '@helgoland/core';
import * as L from 'leaflet';

import { CachedMapComponent } from '../base/cached-map-component';
import { MarkerSelectorGenerator } from './model/marker-selector-generator';

@Directive()
export abstract class MapSelectorComponent<T>
  extends CachedMapComponent
  implements OnChanges, AfterViewInit
{
  protected cd = inject(ChangeDetectorRef);

  /**
   * @input The serviceUrl, where the selection should be loaded.
   */
  public readonly serviceUrl = input<string>();

  /**
   * @input The filter which should be used, while fetching the selection.
   */
  public readonly filter = input<HelgolandParameterFilter>();

  public readonly avoidZoomToSelection = input<boolean>();

  public readonly markerSelectorGenerator = input<MarkerSelectorGenerator>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onSelected = output<T>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onContentLoading = output<boolean>();

  /**
   * @input Additional configuration for the marker zooming (https://leafletjs.com/reference-1.3.4.html#fitbounds-options)
   */
  public readonly fitBoundsMarkerOptions = input<L.FitBoundsOptions>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onNoResultsFound = output<boolean>();

  public ngAfterViewInit() {
    this.createMap();
    setTimeout(() => {
      const serviceUrl = this.serviceUrl();
      if (this.map && serviceUrl) this.drawGeometries(this.map, serviceUrl);
      this.cd.detectChanges();
    }, 10);
  }

  public override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['serviceUrl'] || changes['filter'] || changes['cluster']) {
      const serviceUrl = this.serviceUrl();
      if (this.map && serviceUrl) this.drawGeometries(this.map, serviceUrl);
    }
  }

  /**
   * Draws the geometries
   *
   * @protected
   * @abstract
   */
  protected abstract drawGeometries(map: L.Map, serviceUrl: string): void;

  /**
   * Zooms to the given bounds
   *
   * @protected
   * @param bounds where to zoom
   */
  protected zoomToMarkerBounds(bounds: L.LatLngBoundsExpression, map: L.Map) {
    if (!this.avoidZoomToSelection() && map) {
      map.fitBounds(bounds, this.fitBoundsMarkerOptions() || {});
    }
  }
}
