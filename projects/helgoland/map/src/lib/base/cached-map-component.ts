/* eslint-disable @angular-eslint/no-conflicting-lifecycle */
import {
  Directive,
  DoCheck,
  KeyValueDiffer,
  KeyValueDiffers,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
  input,
  output,
} from '@angular/core';
import * as L from 'leaflet';

import { MapCache } from './map-cache.service';
import { LayerMap, LayerOptions } from './map-options';

const DEFAULT_BASE_LAYER_NAME = 'BaseLayer';
const DEFAULT_BASE_LAYER_URL =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const DEFAULT_BASE_LAYER_ATTRIBUTION =
  '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

@Directive()
export abstract class CachedMapComponent
  implements OnChanges, DoCheck, OnDestroy
{
  protected mapCache = inject(MapCache);
  protected kvDiffers = inject(KeyValueDiffers);

  /**
   * A map with the given ID is created inside this component. This ID can be used the get the map instance over the map cache service.
   */
  public readonly mapId = input.required<string>();

  /**
   * The corresponding leaflet map options (see: https://leafletjs.com/reference-1.3.4.html#map-option)
   */
  public readonly mapOptions = input<L.MapOptions>({ zoomControl: false });

  /**
   * Bounds for the map
   */
  public readonly fitBounds = input<L.LatLngBoundsExpression>();

  /**
   * Map, which holds all overlay map layer (see: https://leafletjs.com/reference-1.3.4.html#layer)
   */
  public readonly overlayMaps = input<LayerMap>();

  /**
   * Map, which holds all base map layer (see: https://leafletjs.com/reference-1.3.4.html#layer)
   */
  public readonly baseMaps = input<LayerMap>();

  /**
   * Describes the the zoom options (see: https://leafletjs.com/reference-1.3.4.html#control-layers)
   */
  public readonly layerControlOptions = input<L.Control.LayersOptions>();

  /**
   * Describes the the zoom control options (see: https://leafletjs.com/reference-1.3.4.html#control-zoom)
   */
  public readonly zoomControlOptions = input<L.Control.ZoomOptions>();

  /**
   * Informs when initialization is done with map id.
   */
  public readonly mapInitialized = output<string>();

  /**
   * The map object.
   */
  protected map: L.Map | undefined;

  protected oldOverlayLayer: L.Control.LayersObject = {};
  protected oldBaseLayer: L.Control.LayersObject = {};
  protected layerControl: L.Control.Layers | undefined;
  protected zoomControl: L.Control.Zoom | undefined;

  private _differOverlayMaps: KeyValueDiffer<string, LayerOptions>;
  private _differBaseMaps: KeyValueDiffer<string, LayerOptions>;

  constructor() {
    this._differOverlayMaps = this.kvDiffers.find({}).create();
    this._differBaseMaps = this.kvDiffers.find({}).create();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.map) {
      const fitBounds = this.fitBounds();
      if (changes['fitBounds'] && fitBounds) {
        this.map.fitBounds(fitBounds);
      }
      if (changes['zoomControlOptions']) {
        this.updateZoomControl();
      }
    }
  }

  public ngDoCheck(): void {
    const overlayMaps = this.overlayMaps();
    if (this._differOverlayMaps && overlayMaps) {
      const changes = this._differOverlayMaps.diff(overlayMaps);
      if (changes) {
        changes.forEachRemovedItem((e) =>
          this.removeOverlayMap(e.previousValue),
        );
        changes.forEachAddedItem((e) => this.addOverlayMap(e.currentValue));
        this.updateLayerControl();
      }
    }
    const baseMaps = this.baseMaps();
    if (this._differBaseMaps && baseMaps) {
      const changes = this._differBaseMaps.diff(baseMaps);
      if (changes) {
        changes.forEachRemovedItem((e) => this.removeBaseMap(e.previousValue));
        changes.forEachAddedItem((e) => this.addBaseMap(e.currentValue));
        this.updateLayerControl();
      }
    }
  }

  public ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
      this.mapCache.deleteMap(this.mapId());
    }
  }

  protected createMap(): void {
    this.map = L.map(this.mapId(), this.mapOptions());
    const mapId = this.mapId();
    this.mapCache.setMap(mapId, this.map);
    this.mapInitialized.emit(mapId);
    const baseMaps = this.baseMaps();
    if (baseMaps && baseMaps.size > 0) {
      baseMaps.forEach((entry, key) => this.addBaseMap(entry));
    } else {
      this.addBaseMap();
    }
    const overlayMaps = this.overlayMaps();
    if (overlayMaps) {
      overlayMaps.forEach((entry, key) => this.addOverlayMap(entry));
    }
    this.updateZoomControl();
    this.updateLayerControl();
    const fitBounds = this.fitBounds();
    if (fitBounds) {
      this.map.fitBounds(fitBounds);
    }
  }

  private generateUUID(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      s4() +
      s4()
    );
  }

  private addOverlayMap(layerOptions: LayerOptions | null) {
    if (this.map && layerOptions) {
      if (!this.oldOverlayLayer.hasOwnProperty(layerOptions.label)) {
        this.oldOverlayLayer[layerOptions.label] = layerOptions.layer;
        if (layerOptions.visible) {
          layerOptions.layer.addTo(this.map);
        }
      }
    }
  }

  private removeOverlayMap(layerOptions: LayerOptions | null) {
    if (
      this.map &&
      layerOptions &&
      this.oldOverlayLayer.hasOwnProperty(layerOptions.label)
    ) {
      this.map.removeLayer(this.oldOverlayLayer[layerOptions.label]);
      delete this.oldOverlayLayer[layerOptions.label];
    }
  }

  private addBaseMap(layerOptions?: LayerOptions | null) {
    if (this.map) {
      const baseMaps = this.baseMaps();
      if (!baseMaps || baseMaps.size === 0) {
        layerOptions = {
          label: DEFAULT_BASE_LAYER_NAME,
          visible: true,
          layer: L.tileLayer(DEFAULT_BASE_LAYER_URL, {
            attribution: DEFAULT_BASE_LAYER_ATTRIBUTION,
          }),
        };
      }
      if (
        layerOptions &&
        !this.oldBaseLayer.hasOwnProperty(layerOptions.label)
      ) {
        this.oldBaseLayer[layerOptions.label] = layerOptions.layer;
        if (layerOptions.visible) {
          layerOptions.layer.addTo(this.map);
        }
      }
    }
  }

  private removeBaseMap(layerOptions: LayerOptions | null) {
    if (
      this.map &&
      layerOptions &&
      this.oldBaseLayer.hasOwnProperty(layerOptions.label)
    ) {
      this.map.removeLayer(this.oldBaseLayer[layerOptions.label]);
      delete this.oldBaseLayer[layerOptions.label];
    }
  }

  private updateLayerControl() {
    if (this.map) {
      if (this.layerControl) {
        this.map.removeControl(this.layerControl);
      }
      const layerControlOptions = this.layerControlOptions();
      if (
        layerControlOptions &&
        (Object.keys(this.oldBaseLayer).length > 1 ||
          Object.keys(this.oldOverlayLayer).length > 0)
      ) {
        this.layerControl = L.control
          .layers(this.oldBaseLayer, this.oldOverlayLayer, layerControlOptions)
          .addTo(this.map);
      }
    }
  }

  private updateZoomControl() {
    if (this.map) {
      if (this.zoomControl) {
        this.map.removeControl(this.zoomControl);
      }
      const zoomControlOptions = this.zoomControlOptions();
      if (zoomControlOptions) {
        this.zoomControl = L.control.zoom(zoomControlOptions).addTo(this.map);
      }
    }
  }
}
