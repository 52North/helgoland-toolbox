import { Injectable } from '@angular/core';
import { DatasetStyle } from '@helgoland/d3';
import { duration, unitOfTime } from 'moment';

import { DatasetOptions } from '../../../../core/src/public-api';
import { BarStyle, LineStyle } from '../d3-series-graph/d3-series-graph.component';
import { D3PointSymbolDrawerService } from './d3-point-symbol-drawer.service';

@Injectable({
  providedIn: 'root'
})
export class D3GraphHelperService {

  constructor(
    protected pointSymbolDrawer: D3PointSymbolDrawerService
  ) { }

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
  public drawDatasetSign(svgElem: d3.Selection<SVGSVGElement, any, any, any>, style: DatasetStyle, xPos: number, yPos: number, selected: boolean) {
    if (style instanceof BarStyle) {
      svgElem.append('rect')
        .attr('class', 'y-axis-line')
        // .attr('id', 'axisdot-line-' + style. options.id)
        .attr('stroke', style.baseColor)
        .attr('fill', style.baseColor)
        .style('fill-opacity', 0.5)
        .attr('x', xPos - 3)
        .attr('y', yPos - 5)
        .attr('width', 6)
        .attr('height', 10)
      return;
    }
    if (style instanceof LineStyle) {
      if (style.lineWidth > 0) {
        const lineLength = 5;
        svgElem.append('line')
          .attr('class', 'y-axis-line')
          // .attr('id', 'axisdot-line-' + options.id)
          .attr('stroke', style.baseColor)
          .attr('fill', style.baseColor)
          .attr('x1', xPos - lineLength * 2)
          .attr('y1', yPos)
          .attr('x2', xPos + lineLength * 2)
          .attr('y2', yPos)
          .attr('stroke-width', style.lineWidth + (selected ? 2 : 0));
      }
      if (style.pointSymbol) {
        this.pointSymbolDrawer.drawSymbol(style.pointSymbol, style.baseColor, svgElem, selected, xPos, yPos);
      } else {
        if (style.pointRadius > 0) {
          svgElem.append('circle')
            .attr('class', 'y-axis-circle')
            // .attr('id', 'axisdot-circle-' + options.id)
            .attr('stroke', style.baseColor)
            .attr('fill', style.baseColor)
            .attr('cx', xPos)
            .attr('cy', yPos)
            .attr('r', style.pointRadius + (selected ? 2 : 0));
        }
      }
    }
  }

  convertDatasetOptions(options: DatasetOptions): DatasetStyle {
    if (options.type === 'line') {
      return new LineStyle(options.color, options.pointRadius, options.lineWidth, options.pointSymbol, options.lineDashArray);
    }
    if (options.type === 'bar') {
      const startOf = options.barStartOf as unitOfTime.StartOf;
      const period = duration(options.barPeriod);
      return new BarStyle(options.color, startOf, period, options.lineWidth, options.lineDashArray);
    }
  }

}
