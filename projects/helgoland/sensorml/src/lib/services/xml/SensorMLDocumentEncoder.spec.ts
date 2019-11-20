
import {
    Component,
    PhysicalSystem
} from '../../model/sml';
import { SensorMLDocumentEncoder } from './SensorMLDocumentEncoder';
import { XPathDocument } from './XPathDocument';

describe('SensorMLDocumentEncoder', () => {

    const service = new SensorMLDocumentEncoder();

    const ps = (function createPhysicalSystem(): PhysicalSystem {
        const physicalSystem = new PhysicalSystem();
        physicalSystem.components.id = 'components';
        physicalSystem.components.components = [
            new Component('My Component', 'http://example.com/MyComponent')
        ];
        return physicalSystem;
    })();

    it('should serialize the component', () => {
        const doc = new XPathDocument(service.encode(ps));
        expect(doc.eval('/sml:PhysicalSystem/sml:components/sml:ComponentList/sml:component/@name')[0].value).toBe(ps.components.components[0].name);
        expect(doc.eval('/sml:PhysicalSystem/sml:components/sml:ComponentList/sml:component/@href')[0].value).toBe(ps.components.components[0].href);
        expect(doc.eval('/sml:PhysicalSystem/sml:components/sml:ComponentList/sml:component/@xlink:href')[0].value).toBe(ps.components.components[0].href);
    });

});
