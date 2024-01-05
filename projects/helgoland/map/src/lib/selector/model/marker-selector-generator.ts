import { HelgolandPlatform } from '@helgoland/core';
import { Layer } from 'leaflet';

export interface MarkerSelectorGenerator {
  createFilledMarker?(station: HelgolandPlatform, color: string): Layer;
  createDefaultFilledMarker?(station: HelgolandPlatform): Layer;
  createDefaultGeometry?(station: HelgolandPlatform): Layer;
}
