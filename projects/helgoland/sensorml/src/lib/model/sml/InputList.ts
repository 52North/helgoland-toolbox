import { AbstractSWE } from '../swe/AbstractSWE';
import { Input } from './Input';
import { DisplayName } from '../../common/decorators/DisplayName';

export class InputList extends AbstractSWE {
    @DisplayName('Inputs')
    inputs: Input[] = [];

    override toString() {
        return 'Input list';
    }
}
