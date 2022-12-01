import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
    GeoCureGeoJSON,
    GeoCureGeoJSONOptions,
    GeoSearchOptions,
    HelgolandLayerControlModule,
    HelgolandMapControlModule,
    HelgolandMapViewModule,
    LayerMap,
    MapCache,
} from '@helgoland/map';
import { circleMarker, LatLngBounds, LayerEvent, LeafletEvent, tileLayer, WMSOptions } from 'leaflet';

@Component({
    templateUrl: './map-view.component.html',
    styleUrls: ['./map-view.component.css'],
    imports: [
        HelgolandMapControlModule,
        CommonModule,
        HelgolandLayerControlModule,
        HelgolandMapViewModule
    ],
    standalone: true
})
export class MapViewComponent implements OnInit, AfterViewInit {

    public fitBounds: L.LatLngBoundsExpression = [[54, 7], [48, 14]];
    public zoomControlOptions: L.Control.ZoomOptions = { position: 'topleft' };
    public overlayMaps: LayerMap = new Map();
    public baseMaps: LayerMap = new Map();
    public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft' };
    public mapOptions: L.MapOptions = { dragging: true, zoomControl: true, boxZoom: true };
    public searchOptions: GeoSearchOptions = { countrycodes: [] };

    private hmsUrl = 'http://colabis.dev.52north.org/geocure/services/colabis-geoserver/features/'
        + '_c8b2d332_2019_4311_a600_eefe94eb6b54/data';

    private scUrl = 'http://colabis.dev.52north.org/geocure/services/colabis-geoserver/features/'
        + '_d6bea91f_ac86_4990_a2d5_c603de92e22c/data';

    private emissionsimulation = 'http://colabis.dev.52north.org/geocure/services/colabis-geoserver/'
        + 'features/_9f064e17_799e_4261_8599_d3ee31b5392b/data';

    private wsfUrl = 'http://colabis.dev.52north.org/geocure/services/colabis-geoserver/features/'
        + '_53fbae20_e2fb_4fd1_b5d6_c798e11b96d1/data';

    private pointStyle: L.CircleMarkerOptions = {
        color: 'red',
        weight: 3,
        radius: 5,
        opacity: 1
    };

    private polygonStyle: L.PathOptions = {
        color: 'blue',
        weight: 3,
        opacity: 1
    };

    public zoomLevel: number;
    public bounds: LatLngBounds;

    constructor(
        private httpClient: HttpClient,
        private mapCache: MapCache
    ) { }

    public ngAfterViewInit(): void {
        this.mapCache.getMap('map-view')
            .on('zoomend', (event) => this.updateLabels(event))
            .on('load', (event) => this.updateLabels(event))
            .on('move', (event) => this.updateLabels(event));
    }

    private updateLabels(event: LeafletEvent) {
        const map: L.Map = event.target;
        this.zoomLevel = map.getZoom();
        this.bounds = map.getBounds();
    }

    public ngOnInit(): void {

        this.baseMaps.set('Topo', {
            label: 'Topo',
            visible: true,
            layer: tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                maxZoom: 17,
                attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, ' +
                    '<a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; ' +
                    '<a href="https://opentopomap.org">OpenTopoMap</a> ' +
                    '(<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            })
        });

        this.baseMaps.set('OM', {
            label: 'OM',
            visible: false,
            layer: tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            })
        });

        // this.addEmmissionSimulationGeoCureLayer();
        // this.addWsfGeoCureLayer();

        // this.overlayMaps.set('interpolated-emissions',
        //     {
        //         label: 'interpolated-emissions',
        //         visible: true,
        //         layer: tileLayer.wms('https://geoserver.colabis.de/geoserver/ckan/wms?', {
        //             layers: 'ckan:_8e2bef33_248f_42b5_bd50_0f474a54d11f',
        //             projection: 'EPSG:4326',
        //             transparent: true
        //         })
        //     },
        // );

        this.overlayMaps.set('fx-product',
            {
                label: 'Radarvorhersage (Basis RX)',
                visible: false,
                layer: tileLayer.wms('https://maps.dwd.de/geoserver/ows?', {
                    layers: 'dwd:FX-Produkt',
                    format: 'image/png',
                    srs: 'EPSG:4326',
                    transparent: true
                } as WMSOptions)
            },
        );

        this.overlayMaps.set('rx-product',
            {
                label: 'Radarkomposit (RX)',
                visible: false,
                layer: tileLayer.wms('https://maps.dwd.de/geoserver/ows?', {
                    layers: 'dwd:RX-Produkt',
                    format: 'image/png',
                    srs: 'EPSG:4326',
                    transparent: true
                } as WMSOptions)
            },
        );
    }

    public addOverlayMapLayer() {
        this.overlayMaps.set('warning-shapes-fine',
            {
                label: 'warning-shapes-fine',
                visible: true,
                layer: tileLayer.wms('https://geoserver.colabis.de/geoserver/ckan/wms?', {
                    maxZoom: 12,
                    minZoom: 11,
                    bounds: [[51.061, 13.751], [51.047, 13.730]],
                    layers: 'ckan:_53fbae20_e2fb_4fd1_b5d6_c798e11b96d1',
                    projection: 'EPSG:4326',
                    format: 'image/png',
                    transparent: true
                } as WMSOptions)
            }
        );
        this.overlayMaps.set('urban-atlas-2006-dresden',
            {
                label: 'urban-atlas-2006-dresden',
                visible: true,
                layer: tileLayer.wms('https://geoserver.colabis.de/geoserver/ckan/wms?', {
                    layers: 'ckan:_7f1cce1a_62b3_49f3_ac3f_cf73ed1586fa',
                    projection: 'EPSG:4326',
                    transparent: true
                } as WMSOptions)
            }
        );
        this.overlayMaps.set('interpolated-emissions',
            {
                label: 'interpolated-emissions',
                visible: true,
                layer: tileLayer.wms('https://geoserver.colabis.de/geoserver/ckan/wms?', {
                    layers: 'ckan:_8e2bef33_248f_42b5_bd50_0f474a54d11f',
                    projection: 'EPSG:4326',
                    transparent: true
                } as WMSOptions)
            },
        );
        this.overlayMaps.set('emission-simulation',
            {
                label: 'emission-simulation',
                visible: true,
                layer: tileLayer.wms('https://geoserver.colabis.de/geoserver/ckan/wms?', {
                    layers: 'ckan:_9f064e17_799e_4261_8599_d3ee31b5392b',
                    projection: 'EPSG:4326',
                    transparent: true
                } as WMSOptions)
            }
        );
        this.overlayMaps.set('warning-shapes-coarse',
            {
                label: 'warning-shapes-coarse',
                visible: true,
                layer: tileLayer.wms('https://geoserver.colabis.de/geoserver/ckan/wms?', {
                    layers: 'ckan:_b2fa0f61_6578_493d_815b_9bd8cfeb2313',
                    projection: 'EPSG:4326',
                    transparent: true
                } as WMSOptions)
            }
        );
        this.overlayMaps.set('Heavy Metal Samples',
            {
                label: 'Heavy Metal Samples',
                visible: true,
                layer: tileLayer.wms('https://geoserver.colabis.de/geoserver/ckan/wms?', {
                    layers: 'ckan:_c8b2d332_2019_4311_a600_eefe94eb6b54',
                    projection: 'EPSG:4326',
                    transparent: true
                } as WMSOptions)
            }
        );
        this.overlayMaps.set('street-cleaning',
            {
                label: 'street-cleaning',
                visible: true,
                layer: tileLayer.wms('https://geoserver.colabis.de/geoserver/ckan/wms?', {
                    layers: 'ckan:_d6bea91f_ac86_4990_a2d5_c603de92e22c',
                    projection: 'EPSG:4326',
                    transparent: true
                } as WMSOptions)
            }
        );
    }

    public removeOverlayMapLayer() {
        this.overlayMaps = new Map();
    }

    private addEmmissionSimulationGeoCureLayer() {
        const options: GeoCureGeoJSONOptions = {
            url: this.emissionsimulation,
            httpClient: this.httpClient,
            showOnMinZoom: 15,
            pointToLayer: (feature, latlng) => {
                return circleMarker(latlng, this.pointStyle);
            },
        };
        const layer = new GeoCureGeoJSON(options);
        layer.on('click', (event: LayerEvent) => {
            const properties = ((event.layer as L.GeoJSON)
                .feature as GeoJSON.Feature<GeoJSON.GeometryObject, any>).properties;
            console.log(properties);
        });
        this.overlayMaps.set('emission', {
            label: 'Emission-Simulation',
            visible: true,
            layer
        });
    }

    private addWsfGeoCureLayer() {
        const options: GeoCureGeoJSONOptions = {
            url: this.wsfUrl,
            httpClient: this.httpClient,
            showOnMinZoom: 10,
            pointToLayer: (feature, latlng) => {
                return circleMarker(latlng, this.pointStyle);
            },
        };
        const layer = new GeoCureGeoJSON(options);
        layer.on('click', (event: LayerEvent) => {
            const properties = ((event.layer as L.GeoJSON)
                .feature as GeoJSON.Feature<GeoJSON.GeometryObject, any>).properties;
            console.log(properties);
        });
        this.overlayMaps.set('wsf', {
            label: 'warning shape fine',
            visible: true,
            layer
        });
    }
}
