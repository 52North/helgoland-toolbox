import * as L from 'leaflet';

export interface MapOptions {
    baseMaps?: Map<string, L.Layer>;
    overlayMaps?: Map<string, L.Layer>;
    layerControlOptions?: L.Control.LayersOptions;
    zoomOptions?: L.Control.ZoomOptions;
}
