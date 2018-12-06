import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
import { DatasetApiInterfaceTesting } from 'projects/testing/dataset-api-interface.testing';
import { Observable, of } from 'rxjs';

import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
import { MapCache } from '../../base/map-cache.service';
import { HelgolandMapSelectorModule } from '../module';
import { LastValuePresentation, StationMapSelectorComponent } from './station-map-selector.component';

const testUrl = '/';

const stations = require('../../../test-data/stations.json');
const timeseries = require('../../../test-data/timeseries.json');

class FakeDatasetApiInterface extends SplittedDataDatasetApiInterface {
    public getStations(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Station[]> {
        return of(stations);
    }

    public getTimeseries(apiUrl: string, params?: ParameterFilter): Observable<Timeseries[]> {
        return of(timeseries);
    }

    public getTimeseriesExtras(id: string, apiUrl: string): Observable<TimeseriesExtras> {
        return of(require('../../../test-data/timeseriesextras' + id + '.json'));
    }
}

describe('StationMapSelectorComponent', () => {
    let component: StationMapSelectorComponent;
    let fixture: ComponentFixture<StationMapSelectorComponent>;
    let httpTestingController: HttpTestingController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                HelgolandCoreModule,
                HelgolandMapSelectorModule,
                TranslateTestingModule
            ],
            providers: [
                {
                    provide: DatasetApiInterface,
                    useClass: FakeDatasetApiInterface
                },
                MapCache
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        httpTestingController = TestBed.get(HttpTestingController);
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
    });
});


describe('StationMapSelectorComponent with external Data', () => {
    let component: StationMapSelectorComponent;
    let fixture: ComponentFixture<StationMapSelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HelgolandCoreModule,
                TranslateTestingModule,
                HelgolandMapSelectorModule
            ],
            providers: [
                DatasetApiInterfaceTesting,
                MapCache
            ],
            declarations: []
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StationMapSelectorComponent);
        (fixture.nativeElement as HTMLElement).style.height = '500px';
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        component.serviceUrl = 'https://www.fluggs.de/sos2/api/v1/';
        component.lastValueSeriesIDs = [
            'https://www.fluggs.de/sos2/api/v1/__51',
            'https://www.fluggs.de/sos2/api/v1/__78',
            'https://www.fluggs.de/sos2/api/v1/__95',
            'https://www.fluggs.de/sos2/api/v1/__54'
        ];
        component.onSelected.subscribe(res => console.log(res));
        component.filter = { phenomenon: '1' };
        component.lastValuePresentation = LastValuePresentation.Textual;
        component.statusIntervals = false;
        component.onSelectedTimeseries.subscribe(ts => console.log(ts));
    });
});
