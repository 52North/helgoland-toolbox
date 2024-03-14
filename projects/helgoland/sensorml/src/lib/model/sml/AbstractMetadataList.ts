// @ts-nocheck
import { AbstractSWEIdentifiable } from '../swe/AbstractSWEIdentifiable';
import { DisplayName } from '../../common/decorators/DisplayName';

export abstract class AbstractMetadataList extends AbstractSWEIdentifiable {
  @DisplayName('Definition')
  definition: string;

  override toString() {
    return super.toString('Abstract metadata list');
  }
}
