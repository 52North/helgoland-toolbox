// @ts-nocheck
import { AbstractPhysicalProcess } from './AbstractPhysicalProcess';
import { ProcessMethod } from './ProcessMethod';
import { ProcessMethodProcess } from './ProcessMethodProcess';
import { DisplayName } from '../../common/decorators/DisplayName';

/**
 * A PhysicalComponent is a physical process that will not be further divided
 * into smaller components.
 */
export class PhysicalComponent extends AbstractPhysicalProcess implements ProcessMethodProcess {
    /**
     * he method describes (as an algorithm or text) how the process takes the
     * input and, based on the parameter values, generates output values.
     */
    @DisplayName('Method')
    method: ProcessMethod;

    // getter
    public static SCHEMA(): string {
        return 'http://schemas.opengis.net/sensorML/2.0/physical_component.xsd';
    }

    public static NAME(): string {
        return 'PhysicalComponent';
    }

    override toString() {
        return 'Physical component';
    }
}
