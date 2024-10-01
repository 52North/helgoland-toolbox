import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { PhysicalSystem } from '../model/sml';
import { SensorMLXmlService } from './SensorMLXmlService';
import { XPathDocument } from './xml/XPathDocument';

describe('SensorMLXmlService', () => {
  const service = new SensorMLXmlService();

  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    http = TestBed.inject(HttpClient);
  });

  // it('should parse the physicalComponentInstance', (done) => {
  //     // const http: HttpClient = TestBed.inject(HttpClient);
  //     debugger;
  //     http.get('src/examples/physicalComponentInstance.xml').subscribe(res => {
  //         debugger;
  //     });
  //     // fs.readFile('./libs/sensorml/src/examples/physicalComponentInstance.xml', 'utf8', (err, xml) => {
  //     //     if (err) throw err;
  //     //     const description = service.deserialize(xml);
  //     //     const xmlSerialized = service.serialize(description);
  //     //     const descriptionDeserialized = service.deserialize(xmlSerialized);
  //     //     expect(description).toEqual(descriptionDeserialized);
  //     //     done();
  //     // });
  // });

  // it('should parse the physicalComponentType', (done) => {
  //     fs.readFile('./libs/sensorml/src/examples/physicalComponentType.xml', 'utf8', (err, xml) => {
  //         const description = service.deserialize(xml);
  //         const xmlSerialized = service.serialize(description);
  //         const descriptionDeserialized = service.deserialize(xmlSerialized);
  //         // console.log(JSON.stringify(description.contacts, null, 2));
  //         // console.log(JSON.stringify(descriptionDeserialized.contacts, null, 2));
  //         expect(description.contacts).toEqual(descriptionDeserialized.contacts);
  //         done();
  //     });
  // });

  // it('should parse the physicalSystemInstance', (done) => {
  //     fs.readFile('./libs/sensorml/src/examples/physicalSystemInstance.xml', 'utf8', (err, xml) => {
  //         const description = service.deserialize(xml);
  //         const xmlSerialized = service.serialize(description);
  //         const descriptionDeserialized = service.deserialize(xmlSerialized);
  //         expect(description).toEqual(descriptionDeserialized);
  //         done();
  //     });
  // });

  // it('should parse the physicalSystemType', (done) => {
  //     fs.readFile('./libs/sensorml/src/examples/physicalSystemType.xml', 'utf8', (err, xml) => {
  //         const description = service.deserialize(xml);
  //         const xmlSerialized = service.serialize(description);
  //         const descriptionDeserialized = service.deserialize(xmlSerialized);
  //         expect(description).toEqual(descriptionDeserialized);
  //         done();
  //     });
  // });

  // it('should parse the allInOn (liseInstance.xml)', (done) => {
  //     fs.readFile('./libs/sensorml/src/examples/physicalSystemType.xml', 'utf8', (err, xml) => {
  //         const description = service.deserialize(xml);
  //         const xmlSerialized = service.serialize(description);
  //         const descriptionDeserialized = service.deserialize(xmlSerialized);
  //         expect(description).toEqual(descriptionDeserialized);
  //         done();
  //     });
  // });

  it('should serialize the document', () => {
    const ps = new PhysicalSystem();
    const doc = XPathDocument.parse(service.serialize(ps));
    expect(doc.eval('/sml:PhysicalSystem')).not.toBeNull();
  });
});
