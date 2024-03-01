import { AbstractAllowedValues } from './AbstractAllowedValues';
import { DisplayName } from '../../common/decorators/DisplayName';

export class AbstractNumericAllowedValues extends AbstractAllowedValues {
    @DisplayName('Significant figures')
    significantFigures: number;

    override toString() {
        return 'Abstract numeric allowed values';
    }
}
