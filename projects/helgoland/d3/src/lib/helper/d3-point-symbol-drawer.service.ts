import { Injectable } from '@angular/core';
import { DatasetOptions, PointSymbol, PointSymbolType } from '@helgoland/core';
import * as d3 from 'd3';

import { DataEntry, InternalDataEntry } from '../model/d3-general';

@Injectable({
  providedIn: 'root'
})
export class D3PointSymbolDrawerService {

  private symbolScaleFactor = 1.75;

  drawSymboleLine(entry: InternalDataEntry, drawPane: d3.Selection<SVGGElement, any, any, any>, additionalSize: number) {
    if (entry.options.pointSymbol) {
      const symbolPath = this.getSymbolPath(entry.options.pointSymbol, entry.selected || false, additionalSize);
      if (symbolPath) {
        drawPane.selectAll('.symbol')
          .data(entry.data.filter((d) => !isNaN(d.value)))
          .enter()
          .append('path')
          .attr('id', (d: DataEntry) => 'dot-' + d.timestamp + '-' + entry.hoverId)
          .attr('transform', (d) => `translate(${d.xDiagCoord},${d.yDiagCoord})`)
          .attr('stroke', entry.options.pointBorderColor)
          .attr('fill', entry.options.color)
          .attr('d', symbolPath)
      }
    }
  }

  private getSymbolPath(pointSymbol: PointSymbol, selected: boolean, additionalSize: number): string | null {
    let symbolType: d3.SymbolType | undefined = undefined;
    switch (pointSymbol.type) {
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
    if (symbolType) {
      return d3.symbol().type(symbolType).size(this.calculateSymbolSize(pointSymbol, selected, additionalSize))();
    }
    return null;
  }

  drawSymbol(options: DatasetOptions, drawPane: d3.Selection<SVGGElement, any, any, any>, selected: boolean, xPos: number, yPos: number) {
    if (options.pointSymbol) {
      const symbolPath = this.getSymbolPath(options.pointSymbol, selected, 1);
      if (symbolPath) {
        drawPane.append('path')
          .attr('class', 'y-axis-circle')
          // .attr('id', 'axisdot-circle-' + options.internalId)
          .attr('transform', (d) => `translate(${xPos},${yPos})`)
          .attr('stroke', options.color)
          .attr('fill', options.color)
          .attr('d', symbolPath);
      }
    }
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

  private calculateSymbolSize(pointSymbol: PointSymbol, selected: boolean, additionalSize: number) {
    if (selected) {
      return (pointSymbol.size + additionalSize) * 15;
    } else {
      return pointSymbol.size * 15;
    }
  }

}
