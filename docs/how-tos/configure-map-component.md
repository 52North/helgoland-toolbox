# How to configure a map component

This tutorial gives a description on how to configure a map component.

## Add a wms layer

With the inputs `overlayMaps` and `baseMaps` you can define, which layer should be presented in the map. Here you see an example on how to add a wms layer to the `overlayMaps` input.

add input to the component:
```html
... [overlayMaps]="overlays" ...
```

add layer to the overlays map:
```typescript
import { tileLayer } from 'leaflet';

this.overlayMaps.set('some-internal-map-id',
    {
        label: 'map-label', // will be shown in layer control
        visible: true, // is layer by default visible
        layer: tileLayer.wms(
            'https://some-wms-url/wms?', // wms-url
            // wms layer options (see: https://leafletjs.com/reference-1.3.4.html#tilelayer-wms)
            {
                maxZoom: 12, // The maximum zoom level to display the layer (inklusive)
                minZoom: 11, // The minimum zoom level to display the layer (inklusive)
                bounds: [[51.061, 13.751], [51.047, 13.730]], // show only in this bounds
                layers: 'layer-id', // comma-seperated list of wms layers to show
                format: 'image/png', // return format
                transparent: true // returns images with transparency
            }
        )
    }
);
```
