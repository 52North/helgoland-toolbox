import { Component, Input } from '@angular/core';
import { DatasetApiInterface, DatasetOptions, Required } from '@helgoland/core';
import * as d3 from 'd3';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'n52-export-image-button',
  templateUrl: './export-image-button.component.html',
  styleUrls: ['./export-image-button.component.css']
})
export class ExportImageButtonComponent {

  @Input() @Required public svgSelector: string;

  @Input() title: string;

  @Input() datasetOptions: Map<string, DatasetOptions>;

  @Input() showLegend: boolean;

  @Input() showFirstLastDate: boolean;

  // @Input() firstLastDate: [Date, Date];

  public firstDate = '2019-09-05';
  public lastDate = '2019-09-28';

  constructor(
    private api: DatasetApiInterface
  ) { }

  public exportImage() {
    const svgElem = document.querySelector<SVGSVGElement>(this.prepareSelector(this.svgSelector));
    const clone = svgElem.cloneNode(true) as SVGSVGElement;
    document.body.appendChild(clone);

    // remove filling (black) for y axis
    clone.querySelectorAll<SVGSVGElement>('.y.axisDiv').forEach(el => el.style.fill = 'none');
    Array.from(clone.getElementsByClassName('y-axis-modifier-button')).map(n => n && n.remove());

    const width = svgElem.width.baseVal.value;
    let height = svgElem.height.baseVal.value;

    if (this.title) {
      height = this.addTitle(clone, this.title, width, height);
    }

    this.addFirstLastDate(clone, width, height);

    if (this.showLegend) {
      this.addLegend(clone, width, height).subscribe(updatedHeight => {
        this.createCanvas(clone, width, updatedHeight);
      });
    } else {
      this.createCanvas(clone, width, height);
    }
  }

  private addFirstLastDate(element: SVGSVGElement, width: number, height: number) {
    const selection = d3.select(element);
    const backgroundRect: d3.Selection<SVGGraphicsElement, {}, HTMLElement, any> = selection.select('.graph-background');

    const firstDate = selection.append<SVGGraphicsElement>('svg:text').text(this.firstDate.toString());
    const firstDateWidth = firstDate.node().getBBox().width;
    firstDate.attr('x', (width - backgroundRect.node().getBBox().width - (firstDateWidth / 2))).attr('y', (height));

    const lastDate = selection.append<SVGGraphicsElement>('svg:text').text(this.lastDate.toString());
    const lastDateWidth = lastDate.node().getBBox().width;
    lastDate.attr('x', (width - lastDateWidth)).attr('y', (height));
  }

  private addLegend(element: SVGSVGElement, width: number, height: number): Observable<number> {
    const obs: Observable<{ label: d3.Selection<SVGGraphicsElement, unknown, null, undefined>, xPos: number }>[] = [];
    const selection = d3.select(element);
    this.datasetOptions.forEach((v, k) => {
      obs.push(this.api.getSingleTimeseriesByInternalId(k).pipe(map(ts => {
        const label = selection.append('g')
          .attr('class', 'legend-entry');
        label.append('circle')
          .attr('class', 'axisDots')
          .attr('stroke', v.color)
          .attr('fill', v.color)
          .attr('cx', -10)
          .attr('cy', -5)
          .attr('r', 4);
        const titleElem = label.append<SVGGraphicsElement>('svg:text').text(ts.label);
        height += 25;
        return {
          label,
          xPos: height - 10
        };
      })));
    });
    return forkJoin(obs).pipe(map(elem => {
      const maxWidth = Math.max(...elem.map(e => e.label.node().getBBox().width));
      elem.forEach(e => e.label.attr('transform', `translate(${(width - maxWidth) / 2},${e.xPos})`));
      return height;
    }));
  }

  private addTitle(element: SVGSVGElement, title: string, width: number, height: number) {
    const addedHeight = 20;

    height += addedHeight;

    const selection = d3.select(element);

    const graph = selection.select<SVGGraphicsElement>('g');

    this.moveDown(graph, addedHeight);

    const titleElem = selection.append<SVGGraphicsElement>('svg:text').text(title);
    const titleWidth = titleElem.node().getBBox().width;
    titleElem.attr('x', (width - titleWidth) / 2).attr('y', '15');

    return height;
  }

  private moveDown(graph: d3.Selection<SVGGraphicsElement, any, null, undefined>, sizeToMove: number) {
    const matrix = graph.style('transform');
    const matrixArray = matrix.substring(7, matrix.length - 1).split(',').map(e => parseInt(e, 10));
    if (matrixArray.length === 6) {
      matrixArray[5] += sizeToMove;
    }
    graph.attr('transform', `matrix(${matrixArray.join(',')})`);
  }

  private createCanvas(element: SVGSVGElement, width: number, height: number) {
    console.log(`Generate Picture with width: ${width} and height: ${height}`);
    const svgString = new XMLSerializer().serializeToString(element);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    const svg = new Blob([svgString], { type: 'image/svg+xml;base64;' });
    const url = window.URL.createObjectURL(svg);
    image.onload = function () {
      ctx.drawImage(image, 0, 0);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(svg, 'report.png');
      } else {
        const png = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        const downloadAttrSupport = typeof a.download !== 'undefined';
        if (downloadAttrSupport) {
          a.download = 'report.png';
          a.href = png;
          a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        }
        window.URL.revokeObjectURL(png);
      }
    };
    image.src = url;
    element.remove();
  }

  private prepareSelector(selector: string): string {
    if (selector.endsWith(' svg')) {
      return selector;
    }
    return `${selector} svg`;
  }

}
