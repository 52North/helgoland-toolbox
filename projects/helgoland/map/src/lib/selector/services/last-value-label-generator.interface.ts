import { Injectable } from '@angular/core';
import { Timeseries } from '@helgoland/core';

@Injectable()
export abstract class LastValueLabelGenerator {

  public abstract createIconLabel(ts: Timeseries);

}
