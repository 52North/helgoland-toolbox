import { Station } from '@helgoland/core';
import { Layer } from 'leaflet';

export interface MarkerSelectorGenerator {
    createFilledMarker?(station: Station, color: string): Layer;
    createDefaultFilledMarker?(station: Station): Layer;
    createDefaultGeometry?(station: Station): Layer;
}
