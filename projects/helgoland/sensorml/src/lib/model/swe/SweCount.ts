import { AbstractSimpleComponent } from './AbstractSimpleComponent';
import { AllowedValues } from './AllowedValues';
import { DisplayName } from '../../common/decorators/DisplayName';

/**
 * Scalar component with integer representation used for a discrete counting
 * value
 */
export class SweCount extends AbstractSimpleComponent {
    /**
     * Value is optional, to enable structure to act as a schema for values
     * provided using other encodings
     */
    @DisplayName('Value')
    override value: number;

    @DisplayName('Constraint')
    override constraint: AllowedValues = new AllowedValues();

    override toString() {
        return 'Count Component';
    }

    getValue() {
        return this.value;
    }
}
