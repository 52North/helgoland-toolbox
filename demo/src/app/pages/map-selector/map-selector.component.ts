import { Component } from '@angular/core';
import * as L from 'leaflet';

import { LayerOptions, MapOptions } from '../../../../../src/components/map/model/map-options';

@Component({
    selector: 'my-app',
    templateUrl: './map-selector.component.html',
    styleUrls: ['./map-selector.component.css']
})
export class MapSelectorComponent {

    public providerUrl = 'http://geo.irceline.be/sos/api/v1/';
    public mapOptions: MapOptions;
    public cluster = true;

    constructor() {

        const baseMaps = new Map<LayerOptions, L.Layer>();

        const overlayMaps = new Map<LayerOptions, L.Layer>();
        overlayMaps.set(
            { name: 'pm10_24hmean_1x1', visible: false },
            L.tileLayer.wms('http://geo.irceline.be/wms', {
                layers: 'pm10_24hmean_1x1',
                transparent: true,
                format: 'image/png',
                time: '2017-12-18T12:00:00.000Z',
                opacity: 0.7,
                pane: 'tilePane',
                zIndex: -9998,
                projection: 'EPSG:4326',
                units: 'm'
            }));

        this.mapOptions = {
            baseMaps,
            overlayMaps,
            layerControlOptions: {
                position: 'bottomleft'
            },
            zoomOptions: {
                position: 'topleft'
            },
            fitBounds: [[49.5, 3.27], [51.5, 5.67]],
            avoidZoomToSelection: false
        };
    }

    public switchProvider() {
        if (this.providerUrl === 'http://geo.irceline.be/sos/api/v1/') {
            this.providerUrl = 'http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/';
        } else {
            this.providerUrl = 'http://geo.irceline.be/sos/api/v1/';
        }
    }
}
