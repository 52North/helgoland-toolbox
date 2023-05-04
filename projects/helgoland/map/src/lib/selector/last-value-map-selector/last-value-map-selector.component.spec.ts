import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DatasetApiV1ConnectorProvider, HelgolandCoreModule } from '@helgoland/core';

import { MapCache } from '../../base/map-cache.service';
import { HelgolandMapSelectorModule } from '../module';
import { LastValuePresentation } from '../services/last-value-label-generator.interface';
import { DatasetApiInterfaceTesting } from '../../../../../../testing/dataset-api-interface.testing';
import { SettingsServiceTestingProvider } from '../../../../../../testing/settings.testing';
import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
import { LastValueMapSelectorComponent } from './last-value-map-selector.component';

describe('LastValueMapSelectorComponent with external Data', () => {
  let component: LastValueMapSelectorComponent;
  let fixture: ComponentFixture<LastValueMapSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        HttpClientModule,
        HelgolandCoreModule,
        TranslateTestingModule,
        HelgolandMapSelectorModule
    ],
    providers: [
        DatasetApiInterfaceTesting,
        DatasetApiV1ConnectorProvider,
        SettingsServiceTestingProvider,
        MapCache
    ]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastValueMapSelectorComponent);
    (fixture.nativeElement as HTMLElement).style.height = '500px';
    component = fixture.componentInstance;
    component.fitBounds = [[49.5, 3.27], [51.5, 5.67]];
    component.avoidZoomToSelection = false;
    component.fitBoundsMarkerOptions = { padding: [20, 20] };
    fixture.detectChanges();
  });

  it('should create', (done) => {
    // TODO: use fake service
    component.lastValuePresentation = LastValuePresentation.Textual;
    component.lastValueSeriesIDs = [
      // 'https://fluggs.wupperverband.de/sws5/api/__51',
      // 'https://fluggs.wupperverband.de/sws5/api/__78',
      // 'https://fluggs.wupperverband.de/sws5/api/__95'
    ];
    component.onSelected.subscribe(res => console.log(res));
    fixture.detectChanges();
    done();

    // setTimeout(() => {
    //   component.lastValueSeriesIDs.push('https://fluggs.wupperverband.de/sws5/api/__54');
    //   // component.lastValueSeriesIDs.splice(1, 1);
    //   // component.fitBounds = [[49.5, 3.27], [51.5, 5.67]];
    //   fixture.detectChanges();
    //   expect(component).toBeTruthy();
    //   done();
    // }, 2000);
  });
});

