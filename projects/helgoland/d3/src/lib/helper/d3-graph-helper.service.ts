import { Injectable } from '@angular/core';
import { DatasetOptions } from '@helgoland/core';

import { D3PointSymbolDrawerService } from './d3-point-symbol-drawer.service';

@Injectable({
  providedIn: 'root',
})
export class D3GraphHelperService {
  constructor(protected pointSymbolDrawer: D3PointSymbolDrawerService) {}

  /**
   * Function that returns the boundings of a html element.
   * @param el {Object} Object of the html element.
   */
  public getDimensions(el: any): { w: number; h: number } {
    let w = 0;
    let h = 0;
    if (el) {
      const dimensions = el.getBBox();
      w = dimensions.width;
      h = dimensions.height;
    } else {
      console.log('error: getDimensions() ' + el + ' not found.');
    }
    return {
      w,
      h,
    };
  }

  /**
   * Draws a datasetoptions based designed sign
   *
   * @param svgElem - SVG Element, where the dataset sign will be appended
   * @param options - used for the styling parameters (color, size)
   * @param xPos - relative x position
   * @param yPos - relative y position
   * @param selected - if selected the sign will be drawn bigger
   */
  public drawDatasetSign(
    svgElem: d3.Selection<SVGGElement, any, any, any>,
    options: DatasetOptions,
    xPos: number,
    yPos: number,
    selected: boolean,
  ) {
    if (options.type === 'bar') {
      svgElem
        .append('rect')
        .attr('class', 'y-axis-line')
        .attr('id', 'axisdot-line-' + options.internalId)
        .attr('stroke', options.color)
        .attr('fill', options.color)
        .style('fill-opacity', 0.5)
        .attr('x', xPos - 3)
        .attr('y', yPos - 5)
        .attr('width', 6)
        .attr('height', 10);
      return;
    }
    if (options.lineWidth > 0) {
      const lineLength = 5;
      svgElem
        .append('line')
        .attr('class', 'y-axis-line')
        .attr('id', 'axisdot-line-' + options.internalId)
        .attr('stroke', options.color)
        .attr('fill', options.color)
        .attr('x1', xPos - lineLength * 2)
        .attr('y1', yPos)
        .attr('x2', xPos + lineLength * 2)
        .attr('y2', yPos)
        .attr('stroke-width', options.lineWidth + (selected ? 2 : 0));
    }
    if (options.pointSymbol) {
      this.pointSymbolDrawer.drawSymbol(options, svgElem, selected, xPos, yPos);
    } else {
      if (options.pointRadius > 0) {
        svgElem
          .append('circle')
          .attr('class', 'y-axis-circle')
          .attr('id', 'axisdot-circle-' + options.internalId)
          .attr('stroke', options.color)
          .attr('fill', options.color)
          .attr('cx', xPos)
          .attr('cy', yPos)
          .attr('r', options.pointRadius + (selected ? 2 : 0));
      }
    }
  }
}
