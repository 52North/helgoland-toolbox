import { HelgolandTimeseries } from '@helgoland/core';

export const enum LastValuePresentation {
  /**
   * colorized circle depending on status intervals
   */
  Colorized,
  /**
   * textual presentation of the last value, done with LastValueLabelGenerator
   */
  Textual,
}

export abstract class LastValueLabelGenerator {
  /**
   * Creates an icon label based on a given timeseries.
   */
  public abstract createIconLabel(
    ts: HelgolandTimeseries,
  ): L.DivIcon | undefined;
}
