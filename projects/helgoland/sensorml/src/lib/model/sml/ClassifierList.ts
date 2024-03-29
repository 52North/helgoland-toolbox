import { AbstractMetadataList } from './AbstractMetadataList';
import { Term } from './Term';
import { DisplayName } from '../../common/decorators/DisplayName';

export class ClassifierList extends AbstractMetadataList {
  @DisplayName('Classifiers')
  classifiers: Term[] = [];

  override toString() {
    return 'Classifier list';
  }

  getLabel() {
    return this.toString();
  }

  getValue() {
    if (this.classifiers.length > 0) {
      return this.classifiers.join(', ');
    }
    return undefined;
  }
}
