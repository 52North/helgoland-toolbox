import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MinMaxRange } from '@helgoland/core';

import { YAxis } from '../../../model/d3-general';
import { D3TimeseriesGraphControl } from '../../d3-timeseries-graph-control';

@Component({
  selector: 'n52-d3-y-axis-modifier',
  template: '',
  styleUrls: ['./d3-y-axis-modifier.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class D3YAxisModifierComponent extends D3TimeseriesGraphControl implements OnInit, OnDestroy {

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

  public ngOnInit() {
    super.ngOnInit();
    this.d3Graph.plotGraph();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.d3Graph.unregisterObserver(this);
    this.d3Graph.plotGraph();
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
      // zoom in horizontal line
      this.d3Graph.getGraphElem().append('line')
        .attr('class', 'axis-button-line zoom-button zoom-in')
        .attr('x1', xAlign - buttonSize)
        .attr('y1', buttonSize * (1.0 + buffer))
        .attr('x2', xAlign + buttonSize)
        .attr('y2', buttonSize * (1.0 + buffer));
      // zoom in vertical line
      this.d3Graph.getGraphElem().append('line')
        .attr('class', 'axis-button-line zoom-button zoom-in')
        .attr('x1', xAlign)
        .attr('y1', buttonSize * (1.0 + buffer) - buttonSize)
        .attr('x2', xAlign)
        .attr('y2', buttonSize * (1.0 + buffer) + buttonSize);
      // zoom in circle to increase are for mouse event
      const zoomInHover = this.d3Graph.getGraphElem().append('circle')
        .attr('class', 'axis-button-circle zoom-button zoom-in zoom-circle')
        .attr('cx', xAlign)
        .attr('cy', buttonSize * (1.0 + buffer))
        .attr('r', buttonSize * 1.5)
        .on('mouseup', () => this.adjustAxisRange(yaxis, step, -step))
        .on('mouseover', () => zoomInHover.classed('hover', true))
        .on('mouseout', () => zoomInHover.classed('hover', false));

      // zoom out horizontal line
      this.d3Graph.getGraphElem().append('line')
        .attr('class', 'axis-button-line zoom-button zoom-out')
        .attr('x1', xAlign - buttonSize)
        .attr('y1', buttonSize * (3.5 + buffer))
        .attr('x2', xAlign + buttonSize)
        .attr('y2', buttonSize * (3.5 + buffer));
      // zoom out circle to increase are for mouse event
      const zoomOutHover = this.d3Graph.getGraphElem().append('circle')
        .attr('class', 'axis-button-circle zoom-button zoom-out zoom-circle')
        .attr('cx', xAlign)
        .attr('cy', buttonSize * (3.5 + buffer))
        .attr('r', buttonSize * 1.5)
        .on('mouseup', () => this.adjustAxisRange(yaxis, -step, step))
        .on('mouseover', () => zoomOutHover.classed('hover', true))
        .on('mouseout', () => zoomOutHover.classed('hover', false));
    }
  }

  private drawResetButton(yaxis: YAxis, buttonSize: number, xAlign: number) {
    if (this.adjustedRanges.has(yaxis.uom)) {
      // add a buffer of +/- 2 to fit element into transparent/hover circle
      // reset button line left top to right bottom
      this.d3Graph.getGraphElem().append('line')
        .attr('class', 'axis-button-line reset-button reset-line')
        .attr('x1', xAlign - buttonSize + 2)
        .attr('y1', buttonSize * 6 - buttonSize + 2)
        .attr('x2', xAlign + buttonSize - 2)
        .attr('y2', buttonSize * 6 + buttonSize - 2);
      // reset button line left bottom to right top
      this.d3Graph.getGraphElem().append('line')
        .attr('class', 'axis-button-line reset-button reset-line')
        .attr('x1', xAlign - buttonSize + 2)
        .attr('y1', buttonSize * 6 + buttonSize - 2)
        .attr('x2', xAlign + buttonSize - 2)
        .attr('y2', buttonSize * 6 - buttonSize + 2);
      // reset button circle to increase area for mouse event
      const resetHover = this.d3Graph.getGraphElem().append('circle')
        .attr('class', 'axis-button-circle reset-button reset-circle')
        .attr('cx', xAlign)
        .attr('cy', buttonSize * 6)
        .attr('r', buttonSize * 1.5)
        .on('mouseup', () => {
          this.adjustedRanges.delete(yaxis.uom);
          this.d3Graph.plotGraph();
        })
        .on('mouseover', () => resetHover.classed('hover', true))
        .on('mouseout', () => resetHover.classed('hover', false));
    }
  }

  private drawShiftButtons(yaxis: YAxis, buttonSize: number, xAlign: number) {
    if (this.shift) {
      const diff = yaxis.range.max - yaxis.range.min;
      const step = diff * this.shiftFactor;
      const shiftToCenter = 0.5 * buttonSize;
      // add buffer of +/- 1 to fit element into transparent/hover circle
      // draw up button left line
      this.d3Graph.getGraphElem().append('line')
        .attr('class', 'axis-button-line shift-button shift-up')
        .attr('x1', xAlign - buttonSize + 1)
        .attr('y1', buttonSize * 1.0 + shiftToCenter - 1)
        .attr('x2', xAlign)
        .attr('y2', buttonSize * 1.0 - buttonSize + shiftToCenter);
      // draw up button right line
      this.d3Graph.getGraphElem().append('line')
        .attr('class', 'axis-button-line shift-button shift-up')
        .attr('x1', xAlign)
        .attr('y1', buttonSize * 1.0 - buttonSize + shiftToCenter)
        .attr('x2', xAlign + buttonSize - 1)
        .attr('y2', buttonSize * 1.0 + shiftToCenter - 1);
      // draw up button circle to increase area for mouse event
      const shiftUpHover = this.d3Graph.getGraphElem().append('circle')
        .attr('class', 'axis-button-circle shift-button shift-up shift-circle')
        .attr('cx', xAlign)
        .attr('cy', buttonSize * 1.0)
        .attr('r', buttonSize * 1.5)
        .on('mouseup', () => this.adjustAxisRange(yaxis, step, step))
        .on('mouseover', () => shiftUpHover.classed('hover', true))
        .on('mouseout', () => shiftUpHover.classed('hover', false));

      // draw down button left line
      this.d3Graph.getGraphElem().append('line')
        .attr('class', 'axis-button-line shift-button shift-down')
        .attr('x1', xAlign - buttonSize + 1)
        .attr('y1', buttonSize * 3.5 - buttonSize + shiftToCenter + 1)
        .attr('x2', xAlign)
        .attr('y2', buttonSize * 3.5 + shiftToCenter);
      // draw down button right line
      this.d3Graph.getGraphElem().append('line')
        .attr('class', 'axis-button-line shift-button shift-down')
        .attr('x1', xAlign)
        .attr('y1', buttonSize * 3.5 + shiftToCenter)
        .attr('x2', xAlign + buttonSize - 1)
        .attr('y2', buttonSize * 3.5 - buttonSize + shiftToCenter + 1);
      // draw down button circle to increase area for mouse event
      const shiftDownHover = this.d3Graph.getGraphElem().append('circle')
        .attr('class', 'axis-button-circle shift-button shift-down shift-circle')
        .attr('cx', xAlign)
        .attr('cy', buttonSize * 3.5)
        .attr('r', buttonSize * 1.5)
        .on('mouseup', () => this.adjustAxisRange(yaxis, -step, -step))
        .on('mouseover', () => shiftDownHover.classed('hover', true))
        .on('mouseout', () => shiftDownHover.classed('hover', false));
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
