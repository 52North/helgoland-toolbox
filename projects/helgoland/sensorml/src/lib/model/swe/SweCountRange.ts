// @ts-nocheck
import { AbstractSweRange } from './AbstractSweRange';
import { AllowedValues } from './AllowedValues';
import { DisplayName } from '../../common/decorators/DisplayName';

/**
 * Integer pair used for specifying a count range
 */
export class SweCountRange extends AbstractSweRange {
    /**
     * Value is a pair of integer numbers separated by a space. It is optional, to
     * enable structure to act as a schema for values provided using other
     * encodings
     */
    @DisplayName('Value')
    override value: [number, number];

    @DisplayName('Constraint')
    override constraint: AllowedValues;

    override toString() {
        return super.toString('SWE count range');
    }
}
