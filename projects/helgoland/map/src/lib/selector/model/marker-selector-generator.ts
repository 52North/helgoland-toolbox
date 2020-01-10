import { HelgolandStation } from '@helgoland/core';
import { Layer } from 'leaflet';

export interface MarkerSelectorGenerator {
    createFilledMarker?(station: HelgolandStation, color: string): Layer;
    createDefaultFilledMarker?(station: HelgolandStation): Layer;
    createDefaultGeometry?(station: HelgolandStation): Layer;
}
