import 'jest-preset-angular';

// Fix tests: https://github.com/openlayers/openlayers/issues/7401
jest.mock('../../../node_modules/ol', () => function() {});
jest.mock('../../../node_modules/ol/Map', () => function() {});
jest.mock('../../../node_modules/ol/control', () => {});
jest.mock('../../../node_modules/ol/control/Zoom', () => function() {});
jest.mock('../../../node_modules/ol/control/Attribution', () => function() {});
jest.mock('../../../node_modules/ol/coordinate', () => function() {});
jest.mock('../../../node_modules/ol/events', () => function() {});
jest.mock('../../../node_modules/ol/events/condition', () => function() {});
jest.mock('../../../node_modules/ol/extent', () => function() {});
jest.mock('../../../node_modules/ol/format/WMSCapabilities', () => function() {});
jest.mock('../../../node_modules/ol/geom/Point', () => function() {});
jest.mock('../../../node_modules/ol/interaction', () => function() {});
jest.mock('../../../node_modules/ol/layer', () => function() {});
jest.mock('../../../node_modules/ol/layer/Base', () => function() {});
jest.mock('../../../node_modules/ol/layer/Layer', () => function() {});
jest.mock('../../../node_modules/ol/layer/Tile', () => function() {});
jest.mock('../../../node_modules/ol/layer/Vector', () => {});
jest.mock('../../../node_modules/ol/proj', () => function() {});
jest.mock('../../../node_modules/ol/source', () => function() {});
jest.mock('../../../node_modules/ol/source/Vector', () => {});
jest.mock('../../../node_modules/ol/source/OSM', () => function() {});
jest.mock('../../../node_modules/ol/style', () => {});