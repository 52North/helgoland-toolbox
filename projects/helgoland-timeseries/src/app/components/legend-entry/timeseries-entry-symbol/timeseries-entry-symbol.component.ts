import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
} from "@angular/core";
import { DatasetOptions } from "@helgoland/core";
import { D3GraphHelperService } from "@helgoland/d3";
import * as d3 from "d3";

@Component({
  selector: "helgoland-timeseries-entry-symbol",
  templateUrl: "./timeseries-entry-symbol.component.html",
  styleUrls: ["./timeseries-entry-symbol.component.scss"],
  standalone: true
})
export class TimeseriesEntrySymbolComponent implements AfterViewInit, DoCheck, OnInit {

  @Input() size: number = 20;

  @Input() options: DatasetOptions | undefined;
  private optionsDiffer: KeyValueDiffer<any, any> | undefined;

  private svg: d3.Selection<SVGGElement, any, HTMLElement, any> | undefined;

  constructor(
    private el: ElementRef,
    protected keyValueDiffers: KeyValueDiffers,
    private graphHelper: D3GraphHelperService
  ) { }

  ngOnInit(): void {
    this.optionsDiffer = this.keyValueDiffers.find({}).create();
  }

  ngAfterViewInit(): void {
    this.initSVG();
    this.drawSymbol();
  }

  ngDoCheck(): void {
    if (this.options && this.optionsDiffer?.diff(this.options)) {
      this.drawSymbol();
    }
  }

  private initSVG() {
    this.svg = d3.select<SVGSVGElement, any>(this.el.nativeElement)
      .append<SVGGElement>("svg")
      .attr("transform", "scale(1.5)")
      .attr("width", this.size)
      .attr("height", this.size);
  }

  private drawSymbol() {
    if (this.svg && this.options) {
      this.svg.selectAll("*").remove();
      this.graphHelper.drawDatasetSign(this.svg, this.options, this.size / 4, this.size / 4, false);
    }
  }
}
