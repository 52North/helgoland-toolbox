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
        setNewTimespan(component);
        component.datasetOptions = datasetOptions;
        const additionalDataOption = new DatasetOptions('horst', '#0000FF');
        additionalDataOption.pointRadius = 6;
        additionalDataOption.lineWidth = 3;
        component.additionalData = [
            {
                yaxisLabel: 'random',
                datasetOptions: additionalDataOption,
                data: [
                    {
                        timestamp: new Date().getTime() - 1000,
                        value: Math.random()
                    },
                    {
                        timestamp: new Date().getTime(),
                        value: Math.random()
                    }
                ]
            }
        ];

        setInterval(() => {
            component.additionalData[0].data.push({
                timestamp: new Date().getTime(),
                value: Math.random()
            });
            component.additionalData = Object.assign([], component.additionalData);
            component.ngOnChanges({
                additionalData: new SimpleChange(null, component.additionalData, true)
            });
            setNewTimespan(component);
            fixture.detectChanges();
        }, 1000);

        fixture.detectChanges();
    });

    it('should have a dataset', () => {
        expect(component.datasetIds).toBeDefined();
        expect(component.datasetIds.length).toBeDefined();
        // expect(component.datasetIds.length).toBeGreaterThan(0);
        expect(typeof (component.datasetIds)).toBe('object');
    });

});

function setNewTimespan(component: ExtendedDataD3TimeseriesGraphComponent) {
    const end = new Date().getTime();
    const diff = 20000;
    component.timeInterval = new Timespan(end - diff, end);
    component.ngOnChanges({
        timeInterval: new SimpleChange(null, component.timeInterval, true)
    });
}

