import { Injectable } from '@angular/core';
import { ColorService, DatasetOptions, DatasetService } from '@helgoland/core';

@Injectable({
  providedIn: 'root'
})
export class TrajectoriesService extends DatasetService<DatasetOptions> {

  constructor(
    private colorSrvc: ColorService
  ) {
    super();
    // TODO: remove
    this.addDataset('http://codm.hzg.de/52n-sos-webapp/api/v1/__measurement_361637');
  }

  public get mainTrajectoryId(): string {
    if (this.datasetIds.length > 0) {
      return this.datasetIds[0];
    }
  }

  public addAdditionalDataset(internalId: string, arg1: { visible: boolean; }) {
    const options = this.createStyles(internalId);
    options.visible = false;
    this.addDataset(internalId, options);
  }

  protected createStyles(internalId: string): DatasetOptions {
    return new DatasetOptions(internalId, this.colorSrvc.getColor());
  }

  protected saveState(): void {
    // TODO: implement
  }

  protected loadState(): void {
    // TODO: implement
  }

}
