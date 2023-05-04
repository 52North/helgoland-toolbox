import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
    DatasetApiInterface,
    HelgolandCoreModule,
    HttpRequestOptions,
    ParameterFilter,
    SplittedDataDatasetApiInterface,
    Station,
    Timeseries,
    TimeseriesExtras,
} from '@helgoland/core';
import { Observable, of } from 'rxjs';

import { SettingsServiceTestingProvider } from '../../../../../../testing/settings.testing';
import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
import { MapCache } from '../../base/map-cache.service';
import { StationMapSelectorComponent } from './station-map-selector.component';

const testUrl = '/';

const stations = require('../../../test-data/stations.json');
const timeseries = require('../../../test-data/timeseries.json');

@Injectable()
class FakeDatasetApiInterface extends SplittedDataDatasetApiInterface {
    public override getStations(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Station[]> {
        return of(stations);
    }

    public override getTimeseries(apiUrl: string, params?: ParameterFilter): Observable<Timeseries[]> {
        return of(timeseries);
    }

    public override getTimeseriesExtras(id: string, apiUrl: string): Observable<TimeseriesExtras> {
        return of(require('../../../test-data/timeseriesextras' + id + '.json'));
    }
}

describe('StationMapSelectorComponent', () => {
    let component: StationMapSelectorComponent;
    let fixture: ComponentFixture<StationMapSelectorComponent>;
    let httpTestingController: HttpTestingController;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                HelgolandCoreModule,
                TranslateTestingModule
            ],
            providers: [
                {
                    provide: DatasetApiInterface,
                    useClass: FakeDatasetApiInterface
                },
                MapCache,
                SettingsServiceTestingProvider
            ],
            declarations: [StationMapSelectorComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        httpTestingController = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(StationMapSelectorComponent);
        (fixture.nativeElement as HTMLElement).style.height = '500px';
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should create', () => {
        component.serviceUrl = testUrl;
        component.onSelected.subscribe(res => console.log(res));
        component.filter = { phenomenon: '1' };
        component.statusIntervals = true;
        // component.cluster = true;
        expect(component).toBeTruthy();
    });
});
