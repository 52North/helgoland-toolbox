import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';

import { D3GeneralDataPoint, D3GeneralDataset, D3GeneralDatasetInput } from '../model/d3-general';

@Component({
    selector: 'n52-d3-general-graph',
    templateUrl: './d3-general-graph.component.html',
    styleUrls: ['./d3-general-graph.component.scss']
})
export class D3GeneralGraphComponent implements AfterViewInit, OnChanges {

    @ViewChild('d3general')
    public d3Elem: ElementRef;

    @Input()
    public generalDataInput: D3GeneralDatasetInput;

    // componentn data variables
    private generalData: D3GeneralDataset;

    // graph components
    private rawSvg: any;
    private graph: any;
    private graphBody: any;

    // component settings
    private height: number;
    private width: number;
    private buffer = 0;

    private margin = {
        top: 10,
        right: 10,
        bottom: 40,
        left: 10
    };

    constructor() { }

    ngAfterViewInit() {
        this.rawSvg = d3.select(this.d3Elem.nativeElement)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        this.graph = this.rawSvg
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
        this.prepareData();
    }

    ngOnChanges(changes) {
        if (changes.generalDataInput && this.rawSvg) {
            this.prepareData();
        }
    }

    private prepareData() {
        if (this.generalDataInput) {
            this.generalData = {
                data: this.generalDataInput.data,
                plotOptions: {
                    xlabel: this.generalDataInput.xlabel,
                    ylabel: this.generalDataInput.ylabel
                }
            };
            this.plotGraph();
        }
    }

    /**
     * Function to call functions related to plotting a dataset in a graph.
     */
    private plotGraph() {
        const dataset = this.generalData;
        this.height = this.calculateHeight();
        this.width = this.calculateWidth();

        dataset.plotOptions.yScale = this.drawYaxis(dataset);
        dataset.plotOptions.xScale = this.drawXaxis(dataset);
        this.drawGraphLine(dataset);
    }



    /**
     * Function to draw y axis.
     * @param dataset {D3GeneralDataset} Object with information about the dataset.
     */
    private drawYaxis(dataset: D3GeneralDataset) {

        // range for y axis scale
        let yRange = d3.extent(d3.values(dataset.data.map((d) => {
            if ((!isNaN(d.x) && !isNaN(d.y))) {
                return d.y;
            }
        })));

        const yRangeOffset = (yRange[1] - yRange[0]) * 0.10;
        const yScale = d3.scaleLinear()
            .domain([yRange[0] - yRangeOffset, yRange[1] + yRangeOffset])
            .range([this.height, 0]);

        let yAxisGen = d3.axisLeft(yScale).ticks(5);

        // draw y axis
        const yAxis = this.graph.append('svg:g')
            .attr('class', 'y axis')
            .call(yAxisGen);

        // draw y axis label
        const yAxisLabel = this.graph.append('text')
            // .attr('transform', 'rotate(-90)')
            .attr('transform', 'translate(0, ' + this.height / 2 + ')rotate(-90)')
            .attr('dy', '1em')
            .attr('class', 'yAxisTextLabel')
            .style('font', '18px times')
            .style('text-anchor', 'middle')
            .style('fill', 'black')
            .text(dataset.plotOptions.ylabel);

        // this.graph.selectAll('.yAxisTextLabel')
        this.buffer = yAxis.node().getBBox().width + 10 + this.getDimensions(yAxisLabel.node()).h;

        yAxis.attr('transform', 'translate(' + this.buffer + ', 0)');

        // draw y grid lines
        this.graph.append('svg:g')
            .attr('class', 'grid')
            .attr('transform', 'translate(' + this.buffer + ', 0)')
            .call(d3.axisLeft(yScale)
                .ticks(5)
                .tickSize(-this.width + this.buffer)
                .tickFormat(() => '')
            );

        return yScale;
    }

    /**
     * Function to draw x axis.
     * @param dataset {D3GeneralDataset} Object with information about the dataset.
     */
    private drawXaxis(dataset: D3GeneralDataset) {

        // range for y axis scale
        let xRange: [number, number] = d3.extent(d3.values(dataset.data.map((d) => {
            if ((!isNaN(d.x) && !isNaN(d.y))) {
                return d.x;
            }
        })));

        const xRangeOffset = (xRange[1] - xRange[0]) * 0.10;
        let xScale = d3.scaleLinear()
            .domain([xRange[0] - xRangeOffset, xRange[1] + xRangeOffset])
            .range([this.buffer, this.width]);

        let xAxis = d3.axisBottom(xScale)
            .ticks(10)
            .tickFormat(d => {
                return '' + d.valueOf();
            });

        this.graph.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(xAxis)
            .selectAll('text')
            .style('text-anchor', 'middle');

        // draw x grid lines
        this.graph.append('svg:g')
            .attr('class', 'grid')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(xAxis
                .tickSize(-this.height)
                .tickFormat(() => '')
            );


        // draw upper axis as border
        this.graph.append('svg:g')
            .attr('class', 'x axis')
            .call(d3.axisTop(xScale)
                .ticks(0)
                .tickSize(0));

        // draw x axis label
        this.graph.append('text')
            .attr('x', (this.width + this.buffer) / 2)
            .attr('y', this.height + this.margin.bottom - 5)
            .style('text-anchor', 'middle')
            .text(dataset.plotOptions.xlabel);

        return xScale;
    }

    /**
     * Function to draw the line of the graph.
     * @param dataset {D3GeneralDataset} Object with information about the datset.
     */
    private drawGraphLine(dataset: D3GeneralDataset) {

        this.graph
            .append('svg:clipPath')
            .attr('id', 'graphLineID')
            .append('svg:rect')
            .attr('x', this.buffer)
            .attr('y', 0)
            .attr('width', this.width - this.buffer)
            .attr('height', this.height);

        // create grah line component
        this.graphBody = this.graph
            .append('g')
            .attr('clip-path', 'url(#' + 'graphLineID' + ')');

        // create line with dataset
        let graphLine = d3.line<D3GeneralDataPoint>()
            .defined(d => (!isNaN(d.x) && !isNaN(d.y)))
            .x((d) => {
                if (!isNaN(d.x) && !isNaN(d.y)) {
                    const x = dataset.plotOptions.xScale(d.x);
                    if (!isNaN(x)) {
                        return x;
                    }
                }
            })
            .y((d) => {
                if (!isNaN(d.x) && !isNaN(d.y)) {
                    const y = dataset.plotOptions.yScale(d.y);
                    if (!isNaN(y)) {
                        return y;
                    }
                }
            })
            .curve(d3.curveLinear);

        // draw graph line
        this.graphBody = this.graph.append('g');
        this.graphBody.append('svg:path')
            .datum(dataset.data)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 4)
            .attr('d', graphLine);

    }

    /**
     * Function that returns the height of the graph diagram.
     */
    private calculateHeight(): number {
        return (this.d3Elem.nativeElement as HTMLElement).clientHeight - this.margin.top - this.margin.bottom;
    }

    /**
     * Function that returns the width of the graph diagram.
     */
    private calculateWidth(): number {
        return this.rawSvg.node().width.baseVal.value - this.margin.left - this.margin.right;
    }

    /**
     * Function that returns the boundings of a html element.
     * @param el {Object} Object of the html element.
     */
    private getDimensions(el: any): { w: number, h: number } {
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

}
