const globals = {
  'tslib': 'tslib',

  '@helgoland/core': 'helgoland.core',
  '@helgoland/time': 'helgoland.time',
  '@helgoland/map': 'helgoland.map',
  '@helgoland/favorite': 'helgoland.favorite',
  '@helgoland/map/selector': 'helgoland.map.selector',
  '@helgoland/depiction': 'helgoland.depiction',
  '@helgoland/depiction/label-mapper': 'helgoland.core.label-mapper',

  '@angular/animations': 'ng.animations',
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  '@angular/forms': 'ng.forms',
  '@angular/http': 'ng.http',
  '@angular/common/http': 'ng.common.http',
  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
  '@angular/platform-browser/animations': 'ng.platformBrowser.animations',

  'rxjs/BehaviorSubject': 'Rx',
  'rxjs/Observable': 'Rx',
  'rxjs/Subject': 'Rx',
  'rxjs/Subscription': 'Rx',
  'rxjs/operator/map': 'Rx.Observable.prototype',
  'rxjs/operator/combineLatest': 'Rx.Observable.prototype',
  'rxjs/operator/filter': 'Rx.Observable.prototype',
  'rxjs/operator/concatMap': 'Rx.Observable.prototype',
  'rxjs/operators/take': 'Rx.Observable.prototype',
  'rxjs/operators/share': 'Rx.Observable.prototype',
  'rxjs/operators/merge': 'Rx.Observable.prototype',
  'rxjs/operators/toArray': 'Rx.Observable.prototype',
  'rxjs/operators/map': 'Rx.Observable.prototype',
  'rxjs/operators/switchMap': 'Rx.Observable.prototype',
  'rxjs/add/operator/map': 'Rx.Observable.prototype',
  'rxjs/observable/of': 'Rx.Observable',

  'jquery': 'jquery',
  'leaflet': 'L',
  'leaflet.markercluster': 'L.markercluster',
  'ngx-clipboard': 'ngxClipboard',
  'ngx-color-picker': 'ngxColorPicker',
  'bootstrap-slider': 'bootstrap-slider',
  'moment': 'moment',
  'd3': 'd3',
  '@ngx-translate/core': '@ngx-translate/core',
  'class-transformer': 'class-transformer'
};

export function jestConfig(config): void {
  if (!config.moduleNameMapper) {
    config.moduleNameMapper = {};
  }

  config.moduleNameMapper['(.*)'] = '<rootDir>/src/$1';
}

export function tsconfig(config) {
  config.angularCompilerOptions.strictMetadataEmit = false;
}

export function rollupFESM(config) {
  if (config.external) {
    config.external = config.external.concat(Object.keys(globals));
  } else {
    config.external = Object.keys(globals);
  }

  config.globals = Object.assign(config.globals || {}, globals);
}

export const rollupUMD = rollupFESM;
