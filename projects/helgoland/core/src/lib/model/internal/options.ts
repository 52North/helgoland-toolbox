/**
 * Options for each dataset.
 *
 * @export
 */
export class DatasetOptions {
  /**
   * internal dataset id
   */
  internalId: string;

  /**
   * type to display the data
   * default is 'line'
   */
  type: 'line' | 'bar' = 'line';

  /**
   * color of the dataset
   */
  color: string;

  /**
   * show or hide in the graph
   */
  visible: boolean = true;

  /**
   * separate y axis of datasets with same unit
   */
  separateYAxis?: boolean = false;

  /**
   * align graph that zero y axis is visible
   */
  zeroBasedYAxis?: boolean = false;

  /**
   * auto zoom when range selection
   */
  autoRangeSelection?: boolean = false;

  /**
   * marker to request dataset data generalized
   */
  generalize?: boolean = false;

  /**
   * list of visible reference values
   */
  showReferenceValues: ReferenceValueOption[] = [];

  /**
   * radius of graphpoint
   * default is 0
   */
  pointRadius: number = 0;

  /**
   * the start of, where to start with the bar chart
   * See also: https://momentjs.com/docs/#/manipulating/start-of/
   * default is 'hour'
   */
  barStartOf: string = 'hour';

  /**
   * period of the bars
   * defined as moment.duration by a string
   * See also: https://momentjs.com/docs/#/durations/
   * default is 'PT1H' which means one hour duration
   */
  barPeriod: string = 'PT1H';

  /**
   * width of graphline
   */
  lineWidth: number = 1;

  /**
   * dasharray to structure the line or bar chart border
   * See also here: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
   */
  lineDashArray?: number | number[];

  /**
   * color of the point border
   */
  pointBorderColor: string;

  /**
   * width of the point border
   */
  pointBorderWidth: number = 0;

  /**
   * min and max range of y axis
   */
  yAxisRange?: MinMaxRange;

  pointSymbol?: PointSymbol;

  constructor(internalId: string, color: string) {
    this.internalId = internalId;
    this.color = color;
    this.pointBorderColor = color;
  }
}

export interface ReferenceValueOption {
  id: string;
  color: string;
}

/**
 * numbered range with a min and a max value
 *
 * @export
 */
export interface MinMaxRange {
  min?: number;
  max?: number;
}

export class TimedDatasetOptions extends DatasetOptions {
  timestamp: number;

  constructor(internalId: string, color: string, timestamp: number) {
    super(internalId, color);
    this.timestamp = timestamp;
  }
}

export enum PointSymbolType {
  cross = 'cross',
  diamond = 'diamond',
  square = 'square',
  star = 'star',
  triangle = 'triangle',
  wye = 'wye',
}
export interface PointSymbol {
  type: PointSymbolType;
  size: number;
}
