import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { PhysicalSystem } from '../model/sml';
import { SensorMLXmlService } from './SensorMLXmlService';
import { XPathDocument } from './xml/XPathDocument';

describe('SensorMLXmlService', () => {

    const service = new SensorMLXmlService();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ]
        });
    });

    it('should parse the physicalComponentInstance', (done) => {
        inject([HttpClient], (http: HttpClient) => {
            http.get('../examples/physicalComponentInstance.xml', { responseType: 'text' }).subscribe(xml => {
                const description = service.deserialize(xml);
                const xmlSerialized = service.serialize(description);
                const descriptionDeserialized = service.deserialize(xmlSerialized);
                expect(description).toEqual(descriptionDeserialized);
                done();
            });
        })();
    });

    it('should parse the physicalComponentType', (done) => {
        inject([HttpClient], (http: HttpClient) => {
            http.get('../examples/physicalComponentType.xml', { responseType: 'text' }).subscribe(xml => {
                const description = service.deserialize(xml);
                const xmlSerialized = service.serialize(description);
                const descriptionDeserialized = service.deserialize(xmlSerialized);
                // console.log(JSON.stringify(description.contacts, null, 2));
                // console.log(JSON.stringify(descriptionDeserialized.contacts, null, 2));
                expect(description.contacts).toEqual(descriptionDeserialized.contacts);
                done();
            });
        })();
    });

    it('should parse the physicalSystemInstance', (done) => {
        inject([HttpClient], (http: HttpClient) => {
            http.get('../examples/physicalSystemInstance.xml', { responseType: 'text' }).subscribe(xml => {
                const description = service.deserialize(xml);
                const xmlSerialized = service.serialize(description);
                const descriptionDeserialized = service.deserialize(xmlSerialized);
                expect(description).toEqual(descriptionDeserialized);
                done();
            });
        })();
    });

    it('should parse the physicalSystemType', (done) => {
        inject([HttpClient], (http: HttpClient) => {
            http.get('../examples/physicalSystemType.xml', { responseType: 'text' }).subscribe(xml => {
                const description = service.deserialize(xml);
                const xmlSerialized = service.serialize(description);
                const descriptionDeserialized = service.deserialize(xmlSerialized);
                expect(description).toEqual(descriptionDeserialized);
                done();
            });
        })();
    });

    it('should parse the allInOn (liseInstance.xml)', (done) => {
        inject([HttpClient], (http: HttpClient) => {
            http.get('../examples/lisaInstance.xml', { responseType: 'text' }).subscribe(xml => {
                const description = service.deserialize(xml);
                const xmlSerialized = service.serialize(description);
                const descriptionDeserialized = service.deserialize(xmlSerialized);
                expect(description).toEqual(descriptionDeserialized);
                done();
            });
        })();
    });

    it('should serialize the document', () => {
        const ps = new PhysicalSystem();
        const doc = XPathDocument.parse(service.serialize(ps));
        expect(doc.eval('/sml:PhysicalSystem')).not.toBeNull();
    });

});
