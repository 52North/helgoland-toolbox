import { AbstractModes } from './AbstractModes';
import { Mode } from './Mode';
import { DisplayName } from '../../common/decorators/DisplayName';

export class ModeChoice extends AbstractModes {
    @DisplayName('Modes')
    modes: Mode[];

    override toString() {
        return 'Mode choice';
    }
}
