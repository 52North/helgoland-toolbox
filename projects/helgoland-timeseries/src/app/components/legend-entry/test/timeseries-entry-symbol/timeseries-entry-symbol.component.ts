import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
} from '@angular/core';
import { DatasetOptions } from '@helgoland/core';
import { D3GraphHelperService } from '@helgoland/d3';
import * as d3 from 'd3';

@Component({
  selector: 'helgoland-timeseries-entry-symbol',
  templateUrl: './timeseries-entry-symbol.component.html',
  styleUrls: ['./timeseries-entry-symbol.component.scss']
})
export class TimeseriesEntrySymbolComponent implements AfterViewInit, DoCheck, OnInit {

  @Input() size: number = 20;

  @Input() options: DatasetOptions;
  private optionsDiffer: KeyValueDiffer<any, any>;

  private svg: d3.Selection<SVGSVGElement, any, HTMLElement, any>;

  constructor(
    private el: ElementRef,
    protected keyValueDiffers: KeyValueDiffers,
    private graphHelper: D3GraphHelperService
  ) { }

  ngOnInit(): void {
    this.optionsDiffer = this.keyValueDiffers.find(this.options).create();
  }

  ngAfterViewInit(): void {
    this.initSVG();
    this.drawSymbol();
  }

  ngDoCheck(): void {
    if (this.optionsDiffer.diff(this.options)) {
      this.drawSymbol();
    }
  }

  private initSVG() {
    this.svg = d3.select<SVGSVGElement, any>(this.el.nativeElement)
      .append<SVGSVGElement>('svg')
      .attr('transform', 'scale(1.5)')
      .attr('width', this.size)
      .attr('height', this.size);
  }

  private drawSymbol() {
    if (this.svg) {
      console.log('draw symbol');
      this.svg.selectAll("*").remove();
      this.graphHelper.drawDatasetSign(this.svg, this.options, this.size / 2, this.size / 2, false);
    }
  }
}
