import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { DatasetApiInterface } from '../../dataset-api/api-interface';
import { HttpService } from '../../dataset-api/http.service';
import { SplittedDataDatasetApiInterface } from '../../dataset-api/splitted-data-api-interface.service';
import { StaDeleteInterfaceService } from '../delete/sta-delete-interface.service';
import { StaInsertInterfaceService } from '../insert/sta-insert-interface.service';
import { InsertLocation } from '../model/locations';
import { InsertThing } from '../model/things';
import { StaReadInterfaceService } from '../read/sta-read-interface.service';
import { TranslateTestingModule } from './../../../../../../testing/translate.testing.module';
import { InternalIdHandler } from './../../dataset-api/internal-id-handler.service';

const staUrl = 'http://docker.srv.int.52north.org:8081/sta/';
const fluggs = 'https://www.fluggs.de/sos2/api/v1/';

describe('StaInsertInterfaceService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientModule,
            TranslateTestingModule
        ],
        providers: [
            HttpService,
            StaReadInterfaceService,
            StaDeleteInterfaceService,
            StaInsertInterfaceService,
            SplittedDataDatasetApiInterface,
            InternalIdHandler
        ]
    }));

    it('should be created', () => {
        const service: StaReadInterfaceService = TestBed.get(StaReadInterfaceService);
        expect(service).toBeTruthy();
    });

    fit('should fetch things', () => {
        const read: StaReadInterfaceService = TestBed.get(StaReadInterfaceService);
        const del: StaDeleteInterfaceService = TestBed.get(StaDeleteInterfaceService);
        const insert: StaInsertInterfaceService = TestBed.get(StaInsertInterfaceService);
        const datasetApi: DatasetApiInterface = TestBed.get(SplittedDataDatasetApiInterface);
        // clearAll(read, del);
        addCompleteThing(insert, read);
        // addFluggsLocations(datasetApi, insert);
        // addSingleDataStream(insert);
        expect(read).toBeTruthy();
    });
});

function addCompleteThing(insert: StaInsertInterfaceService, read: StaReadInterfaceService) {
    const location: InsertLocation = {
        name: '52north2',
        description: '52north2',
        encodingType: 'application/vnd.geo+json',
        location: {
            type: 'Point',
            coordinates: [52.9, 8.2]
        }
    };
    const thing: InsertThing = {
        name: 'thing2',
        description: 'Description of the thing2',
        Locations: [
            location
        ],
        Datastreams: [
            {
                name: 'temp2',
                description: 'Temperature2',
                unitOfMeasurement: {
                    name: 'degree Celsius',
                    symbol: '°C',
                    definition: 'http://unitsofmeasure.org/ucum.html#para-30'
                },
                observationType: 'http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement',
                Observations: [],
                ObservedProperty: {
                    name: 'DewPoint Temperature',
                    definition: 'http://sweet.jpl.nasa.gov/ontology/property.owl#DewPointTemperature',
                    description: 'The dewpoint temperature is the temperature .'
                },
                Sensor: {
                    name: 'Sensor 2',
                    description: 'Sensor description 2',
                    encodingType: '',
                    metadata: 'Metadata sensor'
                }
            }
        ]
    };
    insert.insertThing(staUrl, thing).subscribe(insThing => {
        read.getThing(staUrl, insThing['@iot.id'], { $select: { Datastreams: true }, $expand: { Datastreams: true } }).subscribe(
            getThing => {
                const datastreamId = getThing.Datastreams[0]['@iot.id'];
                for (let i = 0; i < 20; i++) {
                    const observation = {
                        phenomenonTime: `2019-09-02T15:${10 + i}:02-01:00`,
                        result: Math.random() * 20,
                        Datastream: {
                            '@iot.id': datastreamId
                        }
                    };
                    insert.insertObservation(staUrl, observation).subscribe(
                        res => {
                            debugger;
                        },
                        error => {
                            console.error(error.error);
                        }
                    );
                }
            });
    }, error => {
        debugger;
    });
}

function addSingleDataStream(insert: StaInsertInterfaceService) {
    insert.insertDatastream(staUrl, {
        name: 'name',
        description: 'desc',
        observationType: 'http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement',
        unitOfMeasurement: {
            name: 'uom',
            definition: 'definition',
            symbol: 'symbol'
        }
    }).subscribe(
        res => {
            debugger;
        },
        error => {
            debugger;
        }
    );
}

function addFluggsLocations(datasetApi: DatasetApiInterface, insert: StaInsertInterfaceService) {
    datasetApi.getStations(fluggs).subscribe(stations => {
        stations.forEach(station => {
            const loc: InsertLocation = {
                name: station.properties.label,
                description: station.properties.id,
                location: station.geometry,
                encodingType: 'application/vnd.geo+json'
            };
            insert.insertLocation(staUrl, loc).subscribe(res => console.log(`Insert location with id:${res['@iot.id']}`), error => console.error(error.error));
        });
    });
}

function clearAll(read: StaReadInterfaceService, del: StaDeleteInterfaceService) {
    read.getThings(staUrl, { $select: { id: true } })
        .subscribe(res => res.value.forEach(thing => del.deleteThing(staUrl, thing['@iot.id']).subscribe(() => console.log(`delete thing ${thing['@iot.id']}`))));
    // read.getDatastreams(staUrl, { $select: { id: true } })
    //   .subscribe(res => res.value.forEach(thing => del.deleteDatastream(staUrl, thing['@iot.id']).subscribe(() => console.log(`delete datastream ${thing['@iot.id']}`))));
    read.getFeaturesOfInterest(staUrl, { $select: { id: true } })
        .subscribe(res => res.value.forEach(thing => del.deleteFeatureOfInterest(staUrl, thing['@iot.id']).subscribe(() => console.log(`delete feature of interest ${thing['@iot.id']}`))));
    // read.getHistoricalLocations(staUrl, { $select: { id: true } })
    //   .subscribe(res => res.value.forEach(thing => del.deleteHistoricalLocation(staUrl, thing['@iot.id']).subscribe(() => console.log(`delete historical locations ${thing['@iot.id']}`))));
    read.getLocations(staUrl, { $select: { id: true } })
        .subscribe(res => res.value.forEach(thing => del.deleteLocation(staUrl, thing['@iot.id']).subscribe(() => console.log(`delete location ${thing['@iot.id']}`))));
    // read.getObservations(staUrl, { $select: { id: true } })
    //   .subscribe(res => res.value.forEach(thing => del.deleteObservation(staUrl, thing['@iot.id']).subscribe(() => console.log(`delete observation ${thing['@iot.id']}`))));
    read.getObservedProperties(staUrl, { $select: { id: true } })
        .subscribe(res => res.value.forEach(thing => del.deleteObservedProperty(staUrl, thing['@iot.id']).subscribe(() => console.log(`delete observed property ${thing['@iot.id']}`))));
    read.getSensors(staUrl, { $select: { id: true } })
        .subscribe(res => res.value.forEach(thing => del.deleteSensor(staUrl, thing['@iot.id']).subscribe(() => console.log(`delete sensor ${thing['@iot.id']}`))));
}

