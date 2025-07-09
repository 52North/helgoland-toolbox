import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
  inject,
  input,
} from '@angular/core';
import { D3GraphHelperService, DatasetStyle } from '@helgoland/d3';
import * as d3 from 'd3';

@Component({
  selector: 'helgoland-timeseries-entry-symbol',
  templateUrl: './timeseries-entry-symbol.component.html',
  styleUrls: ['./timeseries-entry-symbol.component.scss'],
  standalone: true,
})
export class TimeseriesEntrySymbolComponent
  implements AfterViewInit, DoCheck, OnInit
{
  private el = inject(ElementRef);
  protected keyValueDiffers = inject(KeyValueDiffers);
  private graphHelper = inject(D3GraphHelperService);

  readonly size = input<number>(20);

  readonly datasetStyle = input<DatasetStyle>();
  private optionsDiffer: KeyValueDiffer<any, any> | undefined;

  private svg: d3.Selection<SVGGElement, any, HTMLElement, any> | undefined;

  ngOnInit(): void {
    this.optionsDiffer = this.keyValueDiffers.find({}).create();
  }

  ngAfterViewInit(): void {
    this.initSVG();
    this.drawSymbol();
  }

  ngDoCheck(): void {
    const datasetStyle = this.datasetStyle();
    if (datasetStyle && this.optionsDiffer?.diff(datasetStyle)) {
      this.drawSymbol();
    }
  }

  private initSVG() {
    this.svg = d3
      .select<SVGSVGElement, any>(this.el.nativeElement)
      .append<SVGGElement>('svg')
      .attr('transform', 'scale(1.5)')
      .attr('width', this.size())
      .attr('height', this.size());
  }

  private drawSymbol() {
    const datasetStyle = this.datasetStyle();
    if (this.svg && datasetStyle) {
      this.svg.selectAll('*').remove();
      this.graphHelper.drawDatasetSign(
        this.svg,
        datasetStyle,
        this.size() / 4,
        this.size() / 4,
        false,
      );
    }
  }
}
