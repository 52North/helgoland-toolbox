import { EventEmitter } from '@angular/core';

import { DatasetOptions } from '../model/internal/options';

export abstract class DatasetService<
  T extends DatasetOptions | DatasetOptions[],
> {
  datasetIds: string[] = [];

  datasetOptions: Map<string, T> = new Map();

  datasetIdsChanged: EventEmitter<string[]> = new EventEmitter();

  /**
   * Adds the dataset to the selection
   *
   * @param internalId
   * @param [options]
   * @returns Successfull added the dataset.
   */
  async addDataset(internalId: string, options?: T): Promise<boolean> {
    if (this.datasetIds.indexOf(internalId) < 0) {
      this.datasetIds.push(internalId);
      if (options) {
        this.datasetOptions.set(internalId, options);
      } else {
        this.datasetOptions.set(internalId, this.createStyles(internalId));
      }
      this.saveState();
    } else if (options instanceof Array) {
      const temp = this.datasetOptions.get(internalId) as DatasetOptions[];
      options.forEach((e) => temp.push(e));
      this.saveState();
    }
    this.datasetIdsChanged.emit(this.datasetIds);
    return true;
  }

  removeAllDatasets() {
    this.datasetIds.length = 0;
    this.datasetOptions.clear();
    this.datasetIdsChanged.emit(this.datasetIds);
    this.saveState();
  }

  removeDataset(internalId: string) {
    const datasetIdx = this.datasetIds.indexOf(internalId);
    if (datasetIdx > -1) {
      this.datasetIds.splice(datasetIdx, 1);
      this.datasetOptions.delete(internalId);
    }
    this.datasetIdsChanged.emit(this.datasetIds);
    this.saveState();
  }

  hasDatasets(): boolean {
    return this.datasetIds.length > 0;
  }

  hasDataset(id: string): boolean {
    return this.datasetIds.indexOf(id) >= 0;
  }

  updateDatasetOptions(options: T, internalId: string) {
    this.datasetOptions.set(internalId, options);
    this.saveState();
  }

  protected abstract createStyles(internalId: string): T;

  protected abstract saveState(): void;

  protected abstract loadState(): void;
}
