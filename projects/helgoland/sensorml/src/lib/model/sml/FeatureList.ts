import { DisplayName } from '../../common/decorators/DisplayName';
import { AbstractMetadataList } from './AbstractMetadataList';
import { FeatureProperty } from './FeatureProperty';

export class FeatureList extends AbstractMetadataList {
  @DisplayName('Features')
  feature: FeatureProperty[] = [];

  override toString() {
    return 'Feature list';
  }
}
