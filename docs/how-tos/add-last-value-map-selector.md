# How to Integrate a helgoland map

This tutorial gives a short instruction on how to add a last value map into your app.

## add component to your app

Add Component somewhere to HTML
```html
<n52-last-value-map-selector [lastValueSeriesIDs]="lastValueSeriesIDs" [lastValuePresentation]="lastValuePresentation" [fitBoundsMarkerOptions]="fitBoundsMarkerOptions"></n52-last-value-map-selector>
```

Sample configuration for the component:
```javascript
public lastValueSeriesIDs = [ 'https://fluggs.wupperverband.de/sws5/api/__51', 'https://fluggs.wupperverband.de/sws5/api/__78', 'https://fluggs.wupperverband.de/sws5/api/__95', 'https://fluggs.wupperverband.de/sws5/api/__54' ];
public lastValuePresentation = LastValuePresentation.Textual;
public fitBoundsMarkerOptions: FitBoundsOptions = { padding: [20, 20] };
```

- `lastValueSeriesIDs` - list of internal series ids
- `lastValuePresentation` - type of last value presentation, currently the following options are possible: [here](../../../documentation/miscellaneous/enumerations.html#LastValuePresentation)
- `fitBoundsMarkerOptions` - additional adjustments, while zoom to the marker ([fitbounds options in leaflet](https://leafletjs.com/reference-1.3.4.html#fitbounds-options))

## configure css

Add the css to style the label presentation. Play around to find a good solution for your use case:
```css
.last-value-container {
  background-color: white;
  padding: 3px;
  border: 2px blue solid;
  border-radius: 5px;
  height: auto !important;
  width: auto !important;
  text-align: center;
}

.last-value-container .last-value-date {
  display: none;
  white-space: pre;
}

.last-value-container:hover {
  display: inherit;
  z-index: 999999 !important;
}

.last-value-container:hover .last-value-date {
  display: inherit;
}
```

## adjust service

To adjust the default [LastValueLabelGeneratorService](../../../documentation/injectables/LastValueLabelGeneratorService.html) you can write your own service by extend [LastValueLabelGenerator](../../../documentation/classes/LastValueLabelGenerator.html)

### add service to module in your app.module

```javascript
@NgModule({
  ...
  imports: [
    ...
    HelgolandMapSelectorModule.forRoot({
      lastValueLabelGeneratorService: YourCustomizedLastValueLabelGeneratorService
    }),
    ...
  ],
  ...
})
export class AppModule { }
```
