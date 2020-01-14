import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injector,
  Input,
} from '@angular/core';
import { DatasetOptions, DatasetType, HelgolandServicesHandlerService, Time, Timespan } from '@helgoland/core';
import * as d3 from 'd3';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { D3TimeseriesGraphComponent } from '../d3-timeseries-graph/d3-timeseries-graph.component';
import { D3GraphHelperService } from '../helper/d3-graph-helper.service';

const wrapperClassName = 'export-diagram-wrapper';

@Component({
  selector: 'n52-export-image-button',
  templateUrl: './export-image-button.component.html',
  styleUrls: ['./export-image-button.component.scss']
})
export class ExportImageButtonComponent {

  /**
   * List of datasetIds, similiar to the timeseries component
   */
  @Input() datasetIds: string[];

  /**
   * Map of datasetOptions, similiar to the timeseries component
   */
  @Input() datasetOptions: Map<string, DatasetOptions>;

  /**
   * Timespan, similiar to the timeseries component
   */
  @Input() timespan: Timespan;

  /**
   * Height (as number) in px for the diagram extent, default is 300
   */
  @Input() height = 300;

  /**
   * Width (as number) in px for the diagram extent, default is 600
   */
  @Input() width = 600;

  /**
   * Filename for the exported file, default is 'export'
   */
  @Input() fileName = 'export';

  /**
   * Filetype for the export, currently png and svg are possible, default is 'png'
   */
  @Input() exportType: 'png' | 'svg' = 'png';

  /**
   * Optional title in the picture of the exported file
   */
  @Input() title: string;

  /**
   * Option to show a simple legend in th exported picture
   */
  @Input() showLegend = false;

  /**
   * Option to show first and last date at the bottom edges of the exported picture
   */
  @Input() showFirstLastDate: boolean;

  public loading: boolean;

  private internalHeight: number;
  private internalWidth: number;

  constructor(
    private servicesHandler: HelgolandServicesHandlerService,
    private applicationRef: ApplicationRef,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private timeSrvc: Time,
    private graphHelper: D3GraphHelperService
  ) { }

  public exportImage() {
    this.createDiagramElem();
  }

  private createDiagramElem() {
    this.loading = true;

    this.internalHeight = this.height;
    this.internalWidth = this.width;

    const comp = this.appendComponentToBody(D3TimeseriesGraphComponent) as ComponentRef<D3TimeseriesGraphComponent>;

    comp.instance.datasetIds = this.datasetIds;
    comp.instance.datasetOptions = this.datasetOptions;
    comp.instance.setTimespan(this.timespan);
    comp.instance.presenterOptions = {
      showTimeLabel: false,
      grid: true
    };

    comp.instance.onContentLoading.subscribe(loadFinished => {
      if (loadFinished) {
        setTimeout(() => {
          const temp = this.prepareSelector(`.${wrapperClassName} n52-d3-timeseries-graph`);
          const svgElem = document.querySelector<SVGSVGElement>(temp);
          if (svgElem) {
            this.diagramAdjustments(svgElem).subscribe(() => {
              switch (this.exportType) {
                case 'svg':
                  this.createSvgDownload(svgElem);
                  break;
                case 'png':
                default:
                  this.createPngImageDownload(svgElem);
                  break;
              }
              this.removeComponentFromBody(comp);
              this.loading = false;
            });
          }
        }, 1000);
      }
    });
  }

  private diagramAdjustments(svgElem: SVGSVGElement): Observable<void> {
    // adjust y axis fill out
    svgElem.querySelectorAll<SVGSVGElement>('.y.axisDiv').forEach(el => el.style.fill = 'none');

    // adjust grid lines
    d3.selectAll('.d3 .grid .tick line').style('stroke', '#d3d3d3');

    this.addTitle(svgElem);

    this.addFirstLastDate(svgElem);

    return this.addLegend(svgElem);
  }

  private addFirstLastDate(element: SVGSVGElement) {
    if (this.showFirstLastDate) {
      this.internalHeight += 20;
      const selection = d3.select(element);
      const backgroundRect: d3.Selection<SVGGraphicsElement, {}, HTMLElement, any> = selection.select('.graph-background');

      const firstDate = selection.append<SVGGraphicsElement>('svg:text').text(new Date(this.timespan.from).toLocaleDateString());
      const firstDateWidth = firstDate.node().getBBox().width;
      firstDate.attr('x', (this.internalWidth - backgroundRect.node().getBBox().width - (firstDateWidth / 2))).attr('y', (this.internalHeight));

      const lastDate = selection.append<SVGGraphicsElement>('svg:text').text(new Date(this.timespan.to).toLocaleDateString());
      const lastDateWidth = lastDate.node().getBBox().width;
      lastDate.attr('x', (this.internalWidth - lastDateWidth)).attr('y', (this.internalHeight));
    }
  }

  private addLegend(element: SVGSVGElement): Observable<void> {
    if (this.showLegend) {
      const obs: Observable<{ label: d3.Selection<SVGGraphicsElement, unknown, null, undefined>, xPos: number }>[] = [];
      const selection = d3.select(element);
      this.datasetOptions.forEach((option, k) => {
        obs.push(
          this.servicesHandler.getDataset(k, { type: DatasetType.Timeseries }).pipe(map(ts => {
            if (this.timeSrvc.overlaps(this.timespan, ts.firstValue.timestamp, ts.lastValue.timestamp)) {
              const label = selection.append<SVGSVGElement>('g').attr('class', 'legend-entry');
              this.graphHelper.drawDatasetSign(label, option, -10, -5, false);
              label.append<SVGGraphicsElement>('svg:text').text(ts.label);
              this.internalHeight += 25;
              return {
                label,
                xPos: this.internalHeight - 10
              };
            } else {
              return {
                label: null,
                xPos: 0
              };
            }
          }))
        );
      });
      return forkJoin(obs).pipe(map(elem => {
        const maxWidth = Math.max(...elem.map(e => e.label ? e.label.node().getBBox().width : 0));
        elem.forEach(e => {
          if (e.label) {
            e.label.attr('transform', `translate(${(this.internalWidth - maxWidth) / 2},${e.xPos})`);
          }
        });
      }));
    } else {
      return of(null);
    }
  }

  private addTitle(element: SVGSVGElement) {
    if (this.title) {
      const addedHeight = 20;

      this.internalHeight += addedHeight;

      const selection = d3.select(element);

      const graph = selection.select<SVGGraphicsElement>('g');

      this.moveDown(graph, addedHeight);

      const titleElem = selection.append<SVGGraphicsElement>('svg:text').text(this.title);
      const titleWidth = titleElem.node().getBBox().width;
      titleElem.attr('x', (this.internalWidth - titleWidth) / 2).attr('y', '15');
    }
  }

  private moveDown(graph: d3.Selection<SVGGraphicsElement, any, null, undefined>, sizeToMove: number) {
    const matrix = graph.style('transform');
    const matrixArray = matrix.substring(7, matrix.length - 1).split(',').map(e => parseInt(e, 10));
    if (matrixArray.length === 6) {
      matrixArray[5] += sizeToMove;
    }
    graph.attr('transform', `matrix(${matrixArray.join(',')})`);
  }

  private createPngImageDownload(element: SVGSVGElement) {
    console.log(`Generate PNG file with width: ${this.internalWidth} and height: ${this.internalHeight}`);
    const svgString = new XMLSerializer().serializeToString(element);
    const canvas = document.createElement('canvas');
    canvas.width = this.internalWidth;
    canvas.height = this.internalHeight;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    const svg = new Blob([svgString], { type: 'image/svg+xml;base64;' });
    const url = window.URL.createObjectURL(svg);
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(svg, `${this.fileName}.png`);
      } else {
        const png = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        const downloadAttrSupport = typeof a.download !== 'undefined';
        if (downloadAttrSupport) {
          a.download = `${this.fileName}.png`;
          a.href = png;
          a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        }
        window.URL.revokeObjectURL(png);
      }
    };
    image.src = url;
  }

  private createSvgDownload(element: SVGSVGElement) {
    console.log(`Generate SVG file with width: ${this.internalWidth} and height: ${this.internalHeight}`);
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(element);
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${this.fileName}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  private prepareSelector(selector: string): string {
    if (selector.endsWith(' svg')) {
      return selector;
    }
    return `${selector} svg`;
  }

  private appendComponentToBody(component: any) {
    // create component ref
    const componentRef = this.componentFactoryResolver.resolveComponentFactory(component)
      .create(this.injector);

    // attach component to the appRef.
    this.applicationRef.attachView(componentRef.hostView);

    // get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // create wrapper to set position and size
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.top = `${-this.internalHeight * 2}px`;
    wrapper.className = wrapperClassName;
    wrapper.style.height = `${this.internalHeight}px`;
    wrapper.style.width = `${this.internalWidth}px`;
    wrapper.appendChild(domElem);

    document.body.appendChild(wrapper);

    return componentRef;
  }

  private removeComponentFromBody(componentRef: ComponentRef<any>) {
    this.applicationRef.detachView(componentRef.hostView);
    document.querySelector(`.${wrapperClassName}`).remove();
    componentRef.destroy();
  }

}
