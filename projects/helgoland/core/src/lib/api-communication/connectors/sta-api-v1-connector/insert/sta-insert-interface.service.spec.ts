import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import moment from 'moment';

import { TranslateTestingModule } from '../../../../../../../../testing/translate.testing.module';
import { HttpService } from '../../../../dataset-api/http.service';
import { InternalIdHandler } from '../../../../dataset-api/internal-id-handler.service';
import { SplittedDataDatasetApiInterface } from '../../../../dataset-api/splitted-data-api-interface.service';
import { StaDeleteInterfaceService } from '../delete/sta-delete-interface.service';
import { StaInsertInterfaceService } from '../insert/sta-insert-interface.service';
import { InsertLocation } from '../model/locations';
import { InsertObservation } from '../model/observations';
import { InsertThing } from '../model/things';
import { StaReadInterfaceService } from '../read/sta-read-interface.service';

const staUrl = 'http://docker.srv.int.52north.org:8081/sta/';
const fluggs = 'https://fluggs.wupperverband.de/sws5/api/';

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
        const service: StaReadInterfaceService = TestBed.inject(StaReadInterfaceService);
        expect(service).toBeTruthy();
    });

    it('should fetch things', () => {
        const read: StaReadInterfaceService = TestBed.inject(StaReadInterfaceService);
        const del: StaDeleteInterfaceService = TestBed.inject(StaDeleteInterfaceService);
        const insert: StaInsertInterfaceService = TestBed.inject(StaInsertInterfaceService);
        // clearAll(read, del);
        // setTimeout(() => addCompleteThing(insert, read), 1000);
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
            coordinates: [7.2, 52.9]
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
        read.getThing(staUrl, insThing['@iot.id']!, { $select: { Datastreams: true }, $expand: { Datastreams: true } }).subscribe(
            getThing => {
                const datastreamId = getThing.Datastreams![0]['@iot.id'];
                let counter = 0;
                const interval = setInterval(() => {
                    const observation: InsertObservation = {
                        phenomenonTime: moment().format(),
                        result: (Math.random() * 20).toString(),
                        Datastream: {
                            '@iot.id': datastreamId
                        }
                    };
                    insert.insertObservation(staUrl, observation).subscribe(
                        res => console.log(`insert value at ${observation.phenomenonTime}: ${JSON.stringify(res)}`),
                        error => console.error(error.error)
                    );
                    counter++;
                    if (counter > 5) {
                        clearInterval(interval);
                    }
                }, 1000);
            });
    }, error => console.error(error));
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
            // TODO: implement
        },
        error => {
            // TODO: implement
        }
    );
}

function clearAll(read: StaReadInterfaceService, del: StaDeleteInterfaceService) {
    read.getThings(staUrl, { $select: { id: true } })
        .subscribe(res => res.value.forEach(thing => del.deleteThing(staUrl, thing['@iot.id']!).subscribe(() => console.log(`delete thing ${thing['@iot.id']}`))));
    // read.getDatastreams(staUrl, { $select: { id: true } })
    //   .subscribe(res => res.value.forEach(thing => del.deleteDatastream(staUrl, thing['@iot.id']).subscribe(() => console.log(`delete datastream ${thing['@iot.id']}`))));
    read.getFeaturesOfInterest(staUrl, { $select: { id: true } })
        .subscribe(res => res.value.forEach(thing => del.deleteFeatureOfInterest(staUrl, thing['@iot.id']!).subscribe(() => console.log(`delete feature of interest ${thing['@iot.id']}`))));
    // read.getHistoricalLocations(staUrl, { $select: { id: true } })
    //   .subscribe(res => res.value.forEach(thing => del.deleteHistoricalLocation(staUrl, thing['@iot.id']).subscribe(() => console.log(`delete historical locations ${thing['@iot.id']}`))));
    read.getLocations(staUrl, { $select: { id: true } })
        .subscribe(res => res.value.forEach(thing => del.deleteLocation(staUrl, thing['@iot.id']!).subscribe(() => console.log(`delete location ${thing['@iot.id']}`))));
    // read.getObservations(staUrl, { $select: { id: true } })
    //   .subscribe(res => res.value.forEach(thing => del.deleteObservation(staUrl, thing['@iot.id']).subscribe(() => console.log(`delete observation ${thing['@iot.id']}`))));
    read.getObservedProperties(staUrl, { $select: { id: true } })
        .subscribe(res => res.value.forEach(thing => del.deleteObservedProperty(staUrl, thing['@iot.id']!).subscribe(() => console.log(`delete observed property ${thing['@iot.id']}`))));
    read.getSensors(staUrl, { $select: { id: true } })
        .subscribe(res => res.value.forEach(thing => del.deleteSensor(staUrl, thing['@iot.id']!).subscribe(() => console.log(`delete sensor ${thing['@iot.id']}`))));
}

