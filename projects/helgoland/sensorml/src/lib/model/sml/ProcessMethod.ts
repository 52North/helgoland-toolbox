import { AbstractSWEIdentifiable } from '../swe/AbstractSWEIdentifiable';
import { AbstractAlgorithm } from './AbstractAlgorithm';
import { DisplayName } from '../../common/decorators/DisplayName';

export class ProcessMethod extends AbstractSWEIdentifiable {
  @DisplayName('Algorithm')
  algorithm: AbstractAlgorithm[] = [];

  override toString() {
    return super.toString('Process method');
  }
}
