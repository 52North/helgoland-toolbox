import { Component, Host, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MinMaxRange } from '@helgoland/core';

import { D3TimeseriesGraphComponent, YAxis } from '../d3-timeseries-graph/d3-timeseries-graph.component';
import { D3GraphObserver } from './../d3-timeseries-graph/d3-timeseries-graph.component';

@Component({
  selector: 'n52-d3-y-axis-modifier',
  template: '',
  styleUrls: ['./d3-y-axis-modifier.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class D3YAxisModifierComponent implements OnInit, OnDestroy, D3GraphObserver {

  /**
   * Should the shift buttons be usable.
   */
  @Input() shift = true;

  /**
   * Should the zoom buttons be usable.
   */
  @Input() zoom = true;

  /**
   * The factor, which will be added or subtract on both sides of the range.
   */
  @Input() zoomFactor = 0.1;

  /**
   * The factor, which will be added or subtract on one of the range sides, while shifting.
   */
  @Input() shiftFactor = 0.2;

  private adjustedRanges: Map<string, MinMaxRange> = new Map();

  constructor(
    @Host() private d3Graph: D3TimeseriesGraphComponent
  ) { }

  public ngOnInit() {
    this.d3Graph.registerObserver(this);
  }

  public ngOnDestroy(): void {
    this.d3Graph.unregisterObserver(this);
  }

  public adjustYAxis(axis: YAxis) {
    if ((this.shift || this.zoom) && this.adjustedRanges.has(axis.uom)) {
      axis.range = this.adjustedRanges.get(axis.uom);
    }
  }

  public afterYAxisDrawn(yaxis: YAxis, startX: number, axisHeight: number, axisWidth: number) {
    if (yaxis.range.min && yaxis.range.max) {
      const buttonSize = 7;
      const xAlign = startX + buttonSize * 2;
      this.drawShiftButtons(yaxis, buttonSize, xAlign);
      this.drawResetButton(yaxis, buttonSize, xAlign);
      this.drawZoomButtons(yaxis, buttonSize, xAlign);
    }
  }

  private drawZoomButtons(yaxis: YAxis, buttonSize: number, xAlign: number) {
    if (this.zoom) {
      const diff = yaxis.range.max - yaxis.range.min;
      const step = diff * this.zoomFactor;
      const buffer = this.shift ? 7.5 : 0;
      this.d3Graph.getGraphElem().append('circle')
        .attr('class', 'zoom-button zoom-in')
        .attr('cx', xAlign)
        .attr('cy', buttonSize * (1.0 + buffer))
        .attr('r', buttonSize)
        .on('mouseup', () => this.adjustAxisRange(yaxis, step, -step));
      this.d3Graph.getGraphElem().append('circle')
        .attr('class', 'zoom-button zoom-out')
        .attr('cx', xAlign)
        .attr('cy', buttonSize * (3.5 + buffer))
        .attr('r', buttonSize)
        .on('mouseup', () => this.adjustAxisRange(yaxis, -step, step));
    }
  }

  private drawResetButton(yaxis: YAxis, buttonSize: number, xAlign: number) {
    if (this.adjustedRanges.has(yaxis.uom)) {
      this.d3Graph.getGraphElem().append('circle')
        .attr('class', 'axisDots')
        .attr('cx', xAlign)
        .attr('cy', buttonSize * 6)
        .attr('r', buttonSize)
        .on('mouseup', () => {
          this.adjustedRanges.delete(yaxis.uom);
          this.d3Graph.plotGraph();
        });
    }
  }

  private drawShiftButtons(yaxis: YAxis, buttonSize: number, xAlign: number) {
    if (this.shift) {
      const diff = yaxis.range.max - yaxis.range.min;
      const step = diff * this.shiftFactor;
      // draw up button
      this.d3Graph.getGraphElem().append('circle')
        .attr('class', 'shift-button shift-up')
        .attr('cx', xAlign)
        .attr('cy', buttonSize * 1.0)
        .attr('r', buttonSize)
        .on('mouseup', () => this.adjustAxisRange(yaxis, step, step));
      // draw down button
      this.d3Graph.getGraphElem().append('circle')
        .attr('class', 'shift-button shift-down')
        .attr('cx', xAlign)
        .attr('cy', buttonSize * 3.5)
        .attr('r', buttonSize)
        .on('mouseup', () => this.adjustAxisRange(yaxis, -step, -step));
    }
  }

  private adjustAxisRange(axis: YAxis, adjustMin: number, adjustMax: number) {
    const key = axis.uom;
    if (this.adjustedRanges.has(key)) {
      this.adjustedRanges.get(key).min += adjustMin;
      this.adjustedRanges.get(key).max += adjustMax;
    } else {
      this.adjustedRanges.set(key, {
        min: axis.range.min + adjustMin,
        max: axis.range.max + adjustMax
      });
    }
    this.d3Graph.plotGraph();
  }

}
