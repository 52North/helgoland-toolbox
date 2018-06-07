import 'rxjs/operator/map';

import { Injectable } from '@angular/core';

import { IDataset } from '../model';

const INTERNAL_ID_SEPERATOR = '__';

export interface InternalDatasetId {
  id: string;
  url: string;
}

/**
 * Service to generate or resolve internal dataset IDs
 */
@Injectable()
export class InternalIdHandler {

  /**
   * Generates an internal id for the given dataset.
   * @param dataset The dataset for which the internal id will be generated and saved.
   */
  public generateInternalId(dataset: IDataset) {
    dataset.internalId = dataset.url + INTERNAL_ID_SEPERATOR + dataset.id;
  }

  /**
   * Resolves the internal ID to the url and the API specific dataset id.
   * @param internalId The internal id as string
   * @returns Construct of url and API id
   */
  public resolveInternalId(internalId: string): InternalDatasetId {
    const split = internalId.split(INTERNAL_ID_SEPERATOR);
    if (split.length !== 2) {
      console.error('InternalID ' + internalId + ' is not resolvable');
    } else {
      return {
        url: split[0],
        id: split[1]
      };
    }
  }
}
