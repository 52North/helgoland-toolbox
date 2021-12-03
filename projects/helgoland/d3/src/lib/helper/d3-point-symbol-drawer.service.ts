import { Injectable } from '@angular/core';
import { PointSymbol, PointSymbolType } from '@helgoland/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class D3PointSymbolDrawerService {

  private symbolScaleFactor = 1.75;

  getSymbolPath(pointSymbol: PointSymbol, selected: boolean, additionalSize: number) {
    let symbolType;
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
    var symbolPathData = d3.symbol().type(symbolType).size(this.calculateSymbolSize(pointSymbol, selected, additionalSize))();
    return symbolPathData;
  }

  drawSymbol(pointSymbol: PointSymbol, color: string, drawPane: d3.Selection<SVGGElement, any, any, any>, selected: boolean, xPos: number, yPos: number) {
    drawPane.append('path')
      .attr('class', 'y-axis-circle')
      // .attr('id', 'axisdot-circle-' + options.internalId)
      .attr('transform', (d) => `translate(${xPos},${yPos})`)
      .attr('stroke', color)
      .attr('fill', color)
      .attr('d', this.getSymbolPath(pointSymbol, selected, 1));
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
