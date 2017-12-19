import * as L from 'leaflet';

export interface LayerOptions {
    name: string;
    visible: boolean;
}

export interface MapOptions {
    baseMaps?: Map<LayerOptions, L.Layer>;
    overlayMaps?: Map<LayerOptions, L.Layer>;
    layerControlOptions?: L.Control.LayersOptions;
    zoomOptions?: L.Control.ZoomOptions;
    fitBounds?: L.LatLngBoundsExpression;
    avoidZoomToSelection?: boolean;
}
