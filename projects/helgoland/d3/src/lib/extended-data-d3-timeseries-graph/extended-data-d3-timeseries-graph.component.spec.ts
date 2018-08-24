import { HttpClientModule } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatasetOptions, HelgolandCoreModule, Timespan } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { ExtendedDataD3TimeseriesGraphComponent } from './extended-data-d3-timeseries-graph.component';

describe('D3TimeseriesGraphComponent - function', () => {
    let component: ExtendedDataD3TimeseriesGraphComponent;
    let fixture: ComponentFixture<ExtendedDataD3TimeseriesGraphComponent>;
    let datasetID26 = 'http://www.fluggs.de/sos2/api/v1/__26';
    let datasetID37 = 'http://www.fluggs.de/sos2/api/v1/__37';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HelgolandCoreModule,
                TranslateTestingModule
            ],
            providers: [
                DatasetApiInterfaceTesting
            ],
            declarations: [ExtendedDataD3TimeseriesGraphComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExtendedDataD3TimeseriesGraphComponent);
        (fixture.nativeElement as HTMLElement).style.height = '500px';
        component = fixture.componentInstance;
        const datasetOptions: Map<string, DatasetOptions> = new Map();
        const option26 = new DatasetOptions(datasetID26, '#FF0000');
        option26.pointRadius = 4;
        option26.lineWidth = 2;
        option26.visible = true;
        const option37 = new DatasetOptions(datasetID37, '#00FF00');
        option37.pointRadius = 4;
        option37.lineWidth = 2;
        option37.visible = true;
        datasetOptions.set(datasetID26, option26);
        datasetOptions.set(datasetID37, option37);
        const end = new Date().getTime() + 30000;
        const diff = 50000000;
        component.timeInterval = new Timespan(end - diff, end);
        component.ngOnChanges({
            timeInterval: new SimpleChange(null, component.timeInterval, true)
        });
        component.datasetIds = [datasetID26, datasetID37];
        component.datasetOptions = datasetOptions;
        const additionalDataOption = new DatasetOptions(datasetID26, '#0000FF');
        additionalDataOption.pointRadius = 6;
        additionalDataOption.lineWidth = 3;
        component.additionalData = [
            {
                yaxisLabel: 'test',
                datasetOptions: additionalDataOption,
                data: [{
                    timestamp: new Date(2018, 7, 20, 6, 30).getTime(),
                    value: 293.465
                }, {
                    timestamp: new Date().getTime(),
                    value: 293.49
                }]
            },
            {
                linkedDatasetId: datasetID26,
                datasetOptions: additionalDataOption,
                data: [{
                    timestamp: new Date(2018, 7, 20, 6, 30).getTime(),
                    value: 293.50
                }, {
                    timestamp: new Date().getTime(),
                    value: 293.47
                }]
            }
        ];

        setTimeout(() => {
            component.additionalData = [];
            component.ngOnChanges({
                additionalData: new SimpleChange(null, [], false)
            });
            fixture.detectChanges();
        }, 5000);

        fixture.detectChanges();
    });

    it('should have a dataset', () => {
        expect(component.datasetIds).toBeDefined();
        expect(component.datasetIds.length).toBeDefined();
        expect(component.datasetIds.length).toBeGreaterThan(0);
        expect(typeof (component.datasetIds)).toBe('object');
    });

});

