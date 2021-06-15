import { Injectable } from '@angular/core';
import { DatasetOptions } from '@helgoland/core';

@Injectable({
  providedIn: 'root'
})
export class D3GraphHelperService {

  constructor() { }

  /**
   * Function that returns the boundings of a html element.
   * @param el {Object} Object of the html element.
   */
  public getDimensions(el: any): { w: number, h: number } {
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
      h
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
  public drawDatasetSign(svgElem: d3.Selection<SVGSVGElement, any, any, any>, options: DatasetOptions, xPos: number, yPos: number, selected: boolean) {
    if (options.lineWidth > 0) {
      const lineLength = 4;
      svgElem.append('line')
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
    if (options.pointRadius > 0) {
      svgElem.append('circle')
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
