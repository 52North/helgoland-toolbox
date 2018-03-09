import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GeoSearchOptions, LayerOptions, MapCache } from '@helgoland/map';
import L from 'leaflet';

@Component({
    selector: 'my-app',
    templateUrl: './map-view.component.html',
    styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, AfterViewInit {

    public fitBounds: L.LatLngBoundsExpression = [[50.945, 13.566], [51.161, 13.910]];
    public zoomControlOptions: L.Control.ZoomOptions = { position: 'topleft' };
    public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
    public baseMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
    public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft' };
    public mapOptions: L.MapOptions = { dragging: true, zoomControl: true, boxZoom: true };
    public searchOptions: GeoSearchOptions = { countrycodes: [] };

    private hmsUrl = 'http://colabis.dev.52north.org/geocure/services/colabis-geoserver/features/'
        + '_c8b2d332_2019_4311_a600_eefe94eb6b54/data';

    private scUrl = 'http://colabis.dev.52north.org/geocure/services/colabis-geoserver/features/'
        + '_d6bea91f_ac86_4990_a2d5_c603de92e22c/data';

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

    constructor(
        private httpClient: HttpClient,
        private mapCache: MapCache
    ) { }

    public ngAfterViewInit(): void {
        this.mapCache.getMap('map-view').on('zoomend', (event) => {
            const map: L.Map = event.target;
            console.log('Current zoom level: ' + map.getZoom());
        });
    }

    public ngOnInit(): void {
        this.baseMaps.set('Topo', {
            label: 'Topo',
            visible: true,
            layer: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
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
            layer: L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            })
        });

        this.httpClient
            .get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(this.hmsUrl)
            .subscribe((geojson) => {
                const layer = L.geoJSON(geojson, {
                    pointToLayer: (feature, latlng) => {
                        return L.circleMarker(latlng, this.pointStyle);
                    }
                }).bindPopup((target) => {
                    return 'horst';
                });
                this.overlayMaps.set('hms_geojson', { label: 'hms_geojson', visible: true, layer });
            });

        this.httpClient
            .get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(this.scUrl)
            .subscribe((geojson) => {
                const layer = L.geoJSON(geojson, {
                    style: (feature) => this.polygonStyle
                }).bindPopup((target) => {
                    return 'horst';
                });
                this.overlayMaps.set('sc_geojson', { label: 'sc_geojson', visible: true, layer });
            });
    }

    public addOverlayMapLayer() {
        this.overlayMaps.set('warning-shapes-fine',
            {
                label: 'warning-shapes-fine',
                visible: true,
                layer: L.tileLayer.wms('https://geoserver.colabis.de/geoserver/ckan/wms?', {
                    layers: 'ckan:_53fbae20_e2fb_4fd1_b5d6_c798e11b96d1',
                    projection: 'EPSG:4326',
                    format: 'image/png',
                    transparent: true
                })
            }
        );
        this.overlayMaps.set('urban-atlas-2006-dresden',
            {
                label: 'urban-atlas-2006-dresden',
                visible: true,
                layer: L.tileLayer.wms('https://geoserver.colabis.de/geoserver/ckan/wms?', {
                    layers: 'ckan:_7f1cce1a_62b3_49f3_ac3f_cf73ed1586fa',
                    projection: 'EPSG:4326',
                    transparent: true
                })
            }
        );
        this.overlayMaps.set('interpolated-emissions',
            {
                label: 'interpolated-emissions',
                visible: true,
                layer: L.tileLayer.wms('https://geoserver.colabis.de/geoserver/ckan/wms?', {
                    layers: 'ckan:_8e2bef33_248f_42b5_bd50_0f474a54d11f',
                    projection: 'EPSG:4326',
                    transparent: true
                })
            },
        );
        this.overlayMaps.set('emission-simulation',
            {
                label: 'emission-simulation',
                visible: true,
                layer: L.tileLayer.wms('https://geoserver.colabis.de/geoserver/ckan/wms?', {
                    layers: 'ckan:_9f064e17_799e_4261_8599_d3ee31b5392b',
                    projection: 'EPSG:4326',
                    transparent: true
                })
            }
        );
        this.overlayMaps.set('warning-shapes-coarse',
            {
                label: 'warning-shapes-coarse',
                visible: true,
                layer: L.tileLayer.wms('https://geoserver.colabis.de/geoserver/ckan/wms?', {
                    layers: 'ckan:_b2fa0f61_6578_493d_815b_9bd8cfeb2313',
                    projection: 'EPSG:4326',
                    transparent: true
                })
            }
        );
        this.overlayMaps.set('Heavy Metal Samples',
            {
                label: 'Heavy Metal Samples',
                visible: true,
                layer: L.tileLayer.wms('https://geoserver.colabis.de/geoserver/ckan/wms?', {
                    layers: 'ckan:_c8b2d332_2019_4311_a600_eefe94eb6b54',
                    projection: 'EPSG:4326',
                    transparent: true
                })
            }
        );
        this.overlayMaps.set('street-cleaning',
            {
                label: 'street-cleaning',
                visible: true,
                layer: L.tileLayer.wms('https://geoserver.colabis.de/geoserver/ckan/wms?', {
                    layers: 'ckan:_d6bea91f_ac86_4990_a2d5_c603de92e22c',
                    projection: 'EPSG:4326',
                    transparent: true
                })
            }
        );
    }

    public removeOverlayMapLayer() {
        this.overlayMaps = new Map<string, LayerOptions>();
    }

}
