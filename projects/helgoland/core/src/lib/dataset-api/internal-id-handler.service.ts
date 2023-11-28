import { Injectable } from "@angular/core";

import { IDataset } from "../model/dataset-api/dataset";

const INTERNAL_ID_SEPERATOR = "__";

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
   * Generates and set an internal id for the given dataset.
   * @param dataset The dataset for which the internal id will be generated and saved.
   */
  public generateInternalId(dataset: IDataset) {
    dataset.internalId = dataset.url + INTERNAL_ID_SEPERATOR + dataset.id;
  }

  /**
   * Creates an internal id out of the parameters
   * @param url - service url
   * @param id - service specific id
   * @returns - the internal id
   */
  public createInternalId(url: string, id: string): string {
    return url + INTERNAL_ID_SEPERATOR + id;
  }

  /**
   * Resolves the internal ID to the url and the API specific dataset id.
   * @param internalId The internal id as string
   * @returns Construct of url and API id
   */
  public resolveInternalId(internalId: string | InternalDatasetId): InternalDatasetId {
    if (typeof (internalId) === "string") {
      if (internalId.indexOf(INTERNAL_ID_SEPERATOR) > 0) {
        const url = internalId.substring(0, internalId.indexOf(INTERNAL_ID_SEPERATOR));
        const id = internalId.substring(internalId.indexOf(INTERNAL_ID_SEPERATOR) + INTERNAL_ID_SEPERATOR.length);
        return { url, id };
      }
    } else if (this.instanceOfInternalDatasetId(internalId)) {
      return internalId;
    }
    throw new Error(`InternalID '${internalId}' is not resolvable`);
  }

  private instanceOfInternalDatasetId(object: any): object is InternalDatasetId {
    return "id" in object && "url" in object;
  }
}
