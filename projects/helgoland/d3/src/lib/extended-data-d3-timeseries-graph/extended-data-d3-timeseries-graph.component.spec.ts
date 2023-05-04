import { HttpClientModule } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
    DatasetApiV1ConnectorProvider,
    DatasetApiV3ConnectorProvider,
    DatasetOptions,
    DatasetStaConnectorProvider,
    HelgolandCoreModule,
    Timespan,
} from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { SettingsServiceTestingProvider } from '../../../../../testing/settings.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { HelgolandD3Module } from '../d3.module';
import { ExtendedDataD3TimeseriesGraphComponent } from './extended-data-d3-timeseries-graph.component';

describe('ExtendedDataD3TimeseriesGraphComponent - function', () => {
    let component: ExtendedDataD3TimeseriesGraphComponent;
    let fixture: ComponentFixture<ExtendedDataD3TimeseriesGraphComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
    imports: [
        HttpClientModule,
        HelgolandCoreModule,
        TranslateTestingModule,
        HelgolandD3Module
    ],
    providers: [
        DatasetApiInterfaceTesting,
        DatasetApiV1ConnectorProvider,
        DatasetApiV3ConnectorProvider,
        DatasetStaConnectorProvider,
        SettingsServiceTestingProvider
    ]
}).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExtendedDataD3TimeseriesGraphComponent);
        (fixture.nativeElement as HTMLElement).style.height = '500px';
        component = fixture.componentInstance;
    });

    xit('should have a dataset', () => {
        const datasetID1 = 'https://geo.irceline.be/sos/api/v1/__6522';
        const datasetOptions: Map<string, DatasetOptions> = new Map();
        setNewTimespan(component);
        const option1 = new DatasetOptions(datasetID1, '#FF0000');
        option1.lineDashArray = [5, 5];
        option1.separateYAxis = false;
        // option1.yAxisRange = {
        //   min: -1,
        //   max: 2
        // };
        option1.pointRadius = 4;
        option1.lineWidth = 2;
        option1.visible = true;
        datasetOptions.set(datasetID1, option1);
        component.datasetIds = [datasetID1];
        component.datasetOptions = datasetOptions;
        const additionalDataOption = new DatasetOptions('test', '#0000FF');
        additionalDataOption.pointRadius = 6;
        additionalDataOption.lineWidth = 3;
        component.presenterOptions = {
            yaxis: true
        };
        // additionalDataOption.yAxisRange = {
        //     min: 0,
        //     max: 2
        // };
        // additionalDataOption.autoRangeSelection = true;
        component.additionalData = [
            {
                internalId: 'test',
                // yaxisLabel: 'µg/m³',
                yaxisLabel: 't',
                datasetOptions: additionalDataOption,
                data: [
                    {
                        timestamp: 1559858400000 - 1000 * 60 * 60 * 10,
                        value: 1
                    },
                    {
                        timestamp: 1559858400000 - 1000 * 60 * 60 * 9,
                        value: 2
                    },
                    {
                        timestamp: 1559858400000 - 1000 * 60 * 60 * 8,
                        value: 1
                    },
                    {
                        timestamp: 1559858400000 - 1000 * 60 * 60 * 7,
                        value: 0
                    },
                    {
                        timestamp: 1559858400000 - 1000 * 60 * 60 * 6,
                        value: -0.5
                    },
                    {
                        timestamp: 1559858400000 - 1000 * 60 * 60 * 5,
                        value: 0
                    },
                    {
                        timestamp: 1559858400000 - 1000 * 60 * 60 * 4,
                        value: 1
                    },
                    {
                        timestamp: 1559858400000 - 1000 * 60 * 60 * 3,
                        value: 1
                    },
                    {
                        timestamp: 1559858400000 - 1000 * 60 * 60 * 2,
                        value: 1
                    },
                    {
                        timestamp: 1559858400000 - 1000 * 60 * 60 * 1,
                        value: 1
                    }
                ]
            }
        ];

        // setTimeout(() => {
        //     component.additionalData[0].data.push({
        //         timestamp: 1559858400000,
        //         value: 5
        //     });
        //     component.additionalData = Object.assign([], component.additionalData);
        //     component.ngOnChanges({
        //         additionalData: new SimpleChange(null, component.additionalData, true)
        //     });
        //     // updateTimespan(component);
        //     if (!fixture['destroyed']) {
        //         fixture.detectChanges();
        //     }
        // }, 2000);

        // setTimeout(() => {
        //     component.additionalData.pop();
        //     component.additionalData = Object.assign([], component.additionalData);
        //     component.ngOnChanges({
        //         additionalData: new SimpleChange(null, component.additionalData, true)
        //     });
        //     if (!fixture['destroyed']) {
        //         fixture.detectChanges();
        //     }
        // }, 2000);

        // setTimeout(() => {
        //     const option = new DatasetOptions('test2', '#00FFFF');
        //     option.pointRadius = 6;
        //     option.lineWidth = 3;
        //     component.additionalData.push({
        //         internalId: 'test2',
        //         // yaxisLabel: 'µg/m³',
        //         yaxisLabel: 't',
        //         datasetOptions: option,
        //         data: [
        //             {
        //                 timestamp: 1559858400000 - 1000 * 60 * 60 * 10,
        //                 value: 0.5
        //             },
        //             {
        //                 timestamp: 1559858400000 - 1000 * 60 * 60 * 9,
        //                 value: 0.5
        //             },
        //             {
        //                 timestamp: 1559858400000 - 1000 * 60 * 60 * 8,
        //                 value: 0.5
        //             },
        //             {
        //                 timestamp: 1559858400000 - 1000 * 60 * 60 * 7,
        //                 value: 0.5
        //             },
        //             {
        //                 timestamp: 1559858400000 - 1000 * 60 * 60 * 6,
        //                 value: 0.5
        //             },
        //             {
        //                 timestamp: 1559858400000 - 1000 * 60 * 60 * 5,
        //                 value: 0.5
        //             },
        //             {
        //                 timestamp: 1559858400000 - 1000 * 60 * 60 * 4,
        //                 value: 0.5
        //             },
        //             {
        //                 timestamp: 1559858400000 - 1000 * 60 * 60 * 3,
        //                 value: 1
        //             },
        //             {
        //                 timestamp: 1559858400000 - 1000 * 60 * 60 * 2,
        //                 value: 1
        //             },
        //             {
        //                 timestamp: 1559858400000 - 1000 * 60 * 60 * 1,
        //                 value: 1
        //             }
        //         ]
        //     });
        //     component.additionalData = Object.assign([], component.additionalData);
        //     component.ngOnChanges({
        //         additionalData: new SimpleChange(null, component.additionalData, true)
        //     });
        //     if (!fixture['destroyed']) {
        //         fixture.detectChanges();
        //     }
        // }, 2000);

        if (!fixture['destroy']) {
            fixture.detectChanges();
        }
        expect(component.datasetIds).toBeDefined();
        expect(component.datasetIds.length).toBeDefined();
        expect(typeof (component.datasetIds)).toBe('object');
    });

    it('should work without any data', () => {
        fixture.detectChanges();
        expect(typeof (component.datasetIds)).toBe('object');
    });

});

function setNewTimespan(component: ExtendedDataD3TimeseriesGraphComponent) {
    const end = 1559858400000 + 1000 * 60 * 60 * 1;
    const diff = 1000 * 60 * 60 * 24;
    component.timeInterval = new Timespan(end - diff, end);
    component.ngOnChanges({
        timeInterval: new SimpleChange(null, component.timeInterval, true)
    });
}

function updateTimespan(component: ExtendedDataD3TimeseriesGraphComponent) {
    const end = 1559858400000 + 1000 * 60 * 60 * 2;
    const diff = 1000 * 60 * 60 * 24;
    component.timeInterval = new Timespan(end - diff, end);
    component.ngOnChanges({
        timeInterval: new SimpleChange(null, component.timeInterval, true)
    });
}
