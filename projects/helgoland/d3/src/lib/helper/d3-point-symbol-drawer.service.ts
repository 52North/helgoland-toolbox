import { Injectable } from '@angular/core';
import { DatasetOptions, PointSymbolType } from '@helgoland/core';
import * as d3 from 'd3';

import { DataEntry, InternalDataEntry } from '../model/d3-general';

@Injectable({
  providedIn: 'root'
})
export class D3PointSymbolDrawerService {

  private symbolScaleFactor = 1.75;

  drawSymboleLine(entry: InternalDataEntry, drawPane: d3.Selection<SVGGElement, any, any, any>, additionalSize: number) {
    drawPane.selectAll('.symbol')
      .data(entry.data.filter((d) => !isNaN(d.value)))
      .enter()
      .append('path')
      .attr('id', (d: DataEntry) => 'dot-' + d.timestamp + '-' + entry.hoverId)
      .attr('transform', (d) => `translate(${d.xDiagCoord},${d.yDiagCoord})`)
      .attr('stroke', entry.options.pointBorderColor)
      .attr('fill', entry.options.color)
      .attr('d', this.getSymbolPath(entry.options, entry.selected, additionalSize))
  }

  private getSymbolPath(options: DatasetOptions, selected: boolean, additionalSize: number) {
    let symbolType;
    switch (options.pointSymbol.type) {
      case PointSymbolType.cross:
        symbolType = d3.symbolCross;
        break;
      case PointSymbolType.diamond:
        symbolType = d3.symbolDiamond;
        break;
      case PointSymbolType.square:
        symbolType = d3.symbolSquare;
        break;
      case PointSymbolType.star:
        symbolType = d3.symbolStar;
        break;
      case PointSymbolType.triangle:
        symbolType = d3.symbolTriangle;
        break;
      case PointSymbolType.wye:
        symbolType = d3.symbolWye;
        break;
      default:
        break;
    }
    var symbolPathData = d3.symbol().type(symbolType).size(this.calculateSymbolSize(options, selected, additionalSize))();
    return symbolPathData;
  }

  drawSymbol(options: DatasetOptions, drawPane: d3.Selection<SVGGElement, any, any, any>, selected: boolean, xPos: number, yPos: number) {
    drawPane.append('path')
      .attr('class', 'y-axis-circle')
      // .attr('id', 'axisdot-circle-' + options.internalId)
      .attr('transform', (d) => `translate(${xPos},${yPos})`)
      .attr('stroke', options.color)
      .attr('fill', options.color)
      .attr('d', this.getSymbolPath(options, selected, 1));
  }

  showHovering(symbolElem: d3.Selection<d3.BaseType, any, any, any>) {
    const tr = symbolElem.attr('transform');
    const scaleTerm = `scale(${this.symbolScaleFactor})`;
    if (tr.indexOf(scaleTerm) < 0) {
      symbolElem.attr('transform', `${tr} scale(${this.symbolScaleFactor})`);
    }
  }

  hideHovering(symbolElem: d3.Selection<d3.BaseType, any, any, any>) {
    let tr = symbolElem.attr('transform');
    const scaleTerm = `scale(${this.symbolScaleFactor})`;
    tr = tr.replace(scaleTerm, '');
    symbolElem.attr('transform', `${tr}`);
  }

  private calculateSymbolSize(options: DatasetOptions, selected: boolean, additionalSize: number) {
    if (selected) {
      return (options.pointSymbol.size + additionalSize) * 15;
    } else {
      return options.pointSymbol.size * 15;
    }
  }

}
