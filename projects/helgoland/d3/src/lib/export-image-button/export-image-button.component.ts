import {
  ApplicationRef,
  Component,
  ComponentRef,
  EmbeddedViewRef,
  Input,
  ViewContainerRef,
} from '@angular/core';
import {
  DatasetOptions,
  DatasetType,
  HelgolandServicesConnector,
  HelgolandTimeseries,
  Time,
  Timespan,
} from '@helgoland/core';
import * as d3 from 'd3';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { D3TimeseriesGraphComponent } from '../d3-timeseries-graph/d3-timeseries-graph.component';
import { D3GraphHelperService } from '../helper/d3-graph-helper.service';
import { D3PlotOptions } from '../model/d3-plot-options';

const wrapperClassName = 'export-diagram-wrapper';

@Component({
  selector: 'n52-export-image-button',
  templateUrl: './export-image-button.component.html',
  styleUrls: ['./export-image-button.component.scss'],
  standalone: true,
  imports: [],
})
export class ExportImageButtonComponent {
  /**
   * List of datasetIds, similiar to the timeseries component
   */
  @Input() datasetIds: string[] = [];

  /**
   * Map of datasetOptions, similiar to the timeseries component
   */
  @Input() datasetOptions: Map<string, DatasetOptions> = new Map();

  /**
   * Timespan, similiar to the timeseries component
   */
  @Input({ required: true }) timespan!: Timespan;

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
  @Input() title: string | undefined;

  /**
   * Option to show a simple legend in th exported picture
   */
  @Input() showLegend = false;

  /**
   * Option to show first and last date at the bottom edges of the exported picture
   */
  @Input() showFirstLastDate: boolean = false;

  /**
   * Presenter Options for the exported image
   */
  @Input() presenterOptions: D3PlotOptions = {
    showTimeLabel: false,
    showReferenceValues: true,
    grid: true,
  };

  public loading: boolean = false;

  private internalHeight = this.height;
  private internalWidth = this.width;

  constructor(
    private servicesConnector: HelgolandServicesConnector,
    private applicationRef: ApplicationRef,
    private viewContainerRef: ViewContainerRef,
    private timeSrvc: Time,
    private graphHelper: D3GraphHelperService,
  ) {}

  public exportImage() {
    this.createDiagramElem();
  }

  private createDiagramElem() {
    this.loading = true;
    let once = true;

    this.internalHeight = this.height;
    this.internalWidth = this.width;

    if (this.showFirstLastDate && !this.presenterOptions.timeRangeLabel) {
      this.presenterOptions.timeRangeLabel = { show: true, format: 'L' };
    }

    const comp = this.appendComponentToBody(
      D3TimeseriesGraphComponent,
    ) as ComponentRef<D3TimeseriesGraphComponent>;

    comp.instance.datasetIds = this.datasetIds;
    comp.instance.datasetOptions = this.datasetOptions;
    comp.instance.setTimespan(this.timespan);
    comp.instance.presenterOptions = this.presenterOptions;

    comp.instance.dataLoaded.subscribe((loaded) => {
      if (loaded.size === 0 && once) {
        once = false;
        setTimeout(() => {
          const temp = this.prepareSelector(
            `.${wrapperClassName} n52-d3-timeseries-graph`,
          );
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
    svgElem
      .querySelectorAll<SVGSVGElement>('.y.axisDiv')
      .forEach((el) => (el.style.fill = 'none'));

    // adjust grid lines
    d3.selectAll('.d3 .grid .tick line').style('stroke', '#d3d3d3');

    this.addTitle(svgElem);

    return this.addLegend(svgElem);
  }

  private addLegend(element: SVGSVGElement): Observable<void> {
    if (this.showLegend) {
      const obs: Observable<{
        label: d3.Selection<SVGGElement, unknown, null, undefined> | undefined;
        xPos: number;
      }>[] = [];
      const selection = d3.select(element);
      this.datasetOptions.forEach((option, k) => {
        if (option.visible) {
          obs.push(
            this.servicesConnector
              .getDataset(k, { type: DatasetType.Timeseries })
              .pipe(
                map((ts) => {
                  if (
                    ts.firstValue &&
                    ts.lastValue &&
                    this.timeSrvc.overlaps(
                      this.timespan,
                      ts.firstValue.timestamp,
                      ts.lastValue.timestamp,
                    )
                  ) {
                    const label = selection
                      .append<SVGGElement>('g')
                      .attr('class', 'legend-entry');
                    this.graphHelper.drawDatasetSign(
                      label,
                      option,
                      -10,
                      -5,
                      false,
                    );
                    label
                      .append<SVGGraphicsElement>('svg:text')
                      .text(this.createLabelText(ts));
                    this.internalHeight += 25;
                    return {
                      label,
                      xPos: this.internalHeight - 10,
                    };
                  } else {
                    return {
                      label: undefined,
                      xPos: 0,
                    };
                  }
                }),
              ),
          );
        }
      });
      return forkJoin(obs).pipe(
        map((elem) => {
          const maxWidth = Math.max(
            ...elem.map((e) =>
              e.label?.node() ? e.label.node()!.getBBox().width : 0,
            ),
          );
          elem.forEach((e) => {
            if (e.label) {
              e.label.attr(
                'transform',
                `translate(${(this.internalWidth - maxWidth) / 2},${e.xPos})`,
              );
            }
          });
        }),
      );
    } else {
      return of();
    }
  }

  private createLabelText(ts: HelgolandTimeseries) {
    const labels = [];
    ts.parameters.phenomenon && labels.push(ts.parameters.phenomenon.label);
    ts.parameters.procedure && labels.push(ts.parameters.procedure.label);
    ts.parameters.feature && labels.push(ts.parameters.feature.label);
    return labels.join(', ');
  }

  private addTitle(element: SVGSVGElement) {
    if (this.title) {
      const addedHeight = 20;

      this.internalHeight += addedHeight;

      const selection = d3.select(element);

      const graph = selection.select<SVGGraphicsElement>('g');

      this.moveDown(graph, addedHeight);
      const titleElem = selection
        .append<SVGGraphicsElement>('svg:text')
        .text(this.title);
      const titleElemNode = titleElem.node();
      if (titleElem && titleElemNode) {
        const titleWidth = titleElemNode.getBBox().width;
        titleElem
          .attr('x', (this.internalWidth - titleWidth) / 2)
          .attr('y', '15');
      }
    }
  }

  private moveDown(
    graph: d3.Selection<SVGGraphicsElement, any, null, undefined>,
    sizeToMove: number,
  ) {
    const matrix = (
      document.getElementById(graph.attr('id')) as any
    ).transform.baseVal.consolidate().matrix;
    graph.attr(
      'transform',
      `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${
        matrix.f + sizeToMove
      })`,
    );
  }

  private createPngImageDownload(element: SVGSVGElement) {
    element.setAttribute('width', `${this.internalWidth}px`);
    element.setAttribute('height', `${this.internalHeight}px`);
    const canvas = document.createElement('canvas');
    canvas.width = this.internalWidth;
    canvas.height = this.internalHeight;
    const data = new XMLSerializer().serializeToString(element);
    const win = window.URL;
    const img = new Image();
    const blob = new Blob([data], { type: 'image/svg+xml' });
    const url = win.createObjectURL(blob);
    img.onload = () => {
      canvas.getContext('2d')?.drawImage(img, 0, 0);
      win.revokeObjectURL(url);
      const uri = canvas
        .toDataURL('image/png')
        .replace('image/png', 'octet/stream');
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = uri;
      a.download =
        (element.id ||
          element.getAttribute('name') ||
          element.getAttribute('aria-label') ||
          this.fileName) + '.png';
      a.click();
      window.URL.revokeObjectURL(uri);
      document.body.removeChild(a);
    };
    img.src = url;
  }

  private createSvgDownload(element: SVGSVGElement) {
    console.log(
      `Generate SVG file with width: ${this.internalWidth} and height: ${this.internalHeight}`,
    );
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(element);
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(
        /^<svg/,
        '<svg xmlns="http://www.w3.org/2000/svg"',
      );
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(
        /^<svg/,
        '<svg xmlns:xlink="http://www.w3.org/1999/xlink"',
      );
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
    const componentRef = this.viewContainerRef.createComponent(component);

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
    document.querySelector(`.${wrapperClassName}`)?.remove();
    componentRef.destroy();
  }
}
