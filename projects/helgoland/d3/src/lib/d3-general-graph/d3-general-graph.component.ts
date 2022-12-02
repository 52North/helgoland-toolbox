import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import moment from 'moment';

import { D3TimeFormatLocaleService } from '../helper/d3-time-format-locale.service';
import {
    D3GeneralAxisOptions,
    D3GeneralDataPoint,
    D3GeneralDataset,
    D3GeneralGraphOptions,
    D3GeneralInput,
    D3GeneralPlotOptions,
    Range,
} from '../model/d3-general';

@Component({
    selector: 'n52-d3-general-graph',
    templateUrl: './d3-general-graph.component.html',
    styleUrls: ['./d3-general-graph.component.scss']
})
export class D3GeneralGraphComponent implements AfterViewInit, OnChanges {

    @ViewChild('d3general', { static: true })
    public d3Elem: ElementRef;

    @Input()
    public generalD3Input: D3GeneralInput;

    // componennt data variables
    private generalData: D3GeneralDataset[] = [];
    private axisOptions: D3GeneralAxisOptions = {};
    private plotOptions: D3GeneralPlotOptions = {
        xlabel: 'x',
        ylabel: 'y',
        date: false
    };

    private defaultGraphOptions: D3GeneralGraphOptions = {
        color: 'red',
        lines: {
            lineWidth: 2,
            pointRadius: 2
        }
    };

    // graph components
    private rawSvg: any;
    private graph: any;
    private graphBody: any;
    private background: any;
    private graphFocus: any;
    private focusG: any;
    private highlightRect: any;
    private highlightText: any;

    // component settings
    private height: number;
    private width: number;
    private buffer = 0;
    private maxLabelwidth = 0;

    private margin = {
        top: 10,
        right: 10,
        bottom: 40,
        left: 10
    };

    constructor(
        protected timeFormatLocaleService: D3TimeFormatLocaleService
    ) { }

    ngAfterViewInit() {
        this.rawSvg = d3.select(this.d3Elem.nativeElement)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        this.graph = this.rawSvg
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.graphFocus = this.rawSvg
            .append('g')
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');


        this.prepareData();
    }

    ngOnChanges(changes) {
        if (changes.generalD3Input && this.rawSvg) {
            this.generalD3Input = changes.generalD3Input.currentValue;
            this.prepareData();
        }
    }

    private prepareData() {
        if (this.generalD3Input) {
            // add all input dataset into one array (public generalData)
            let data = [];

            this.generalD3Input.datasets.forEach((ds, index) => {
                const dataset: D3GeneralDataset = {
                    data: ds.data,
                    id: index
                };
                data = data.concat(ds.data);
                this.generalData.push(dataset);
            });

            this.plotOptions = this.generalD3Input.plotOptions;
            this.axisOptions.date = true;
            this.axisOptions.xRange = this.getRange(data, 'x');
            this.axisOptions.yRange = this.getRange(data, 'y');

            this.plotGraph();
        }
    }

    /**
     * Function to call functions related to plotting a dataset in a graph.
     */
    private plotGraph() {
        this.height = this.calculateHeight();
        this.width = this.calculateWidth();

        this.axisOptions.yScale = this.drawYaxis(this.plotOptions);
        this.axisOptions.xScale = this.drawXaxis(this.plotOptions);

        // create background as rectangle providing panning
        this.background = this.graph.append('svg:rect')
            .attr('width', this.width - this.buffer)
            .attr('height', this.height)
            .attr('id', 'backgroundRect')
            .attr('fill', 'none')
            .attr('stroke', 'none')
            .attr('pointer-events', 'all')
            .attr('transform', 'translate(' + this.buffer + ', 0)');


        this.focusG = this.graphFocus.append('g');
        this.highlightRect = this.focusG.append('svg:rect');
        this.highlightText = this.focusG.append('svg:text');

        this.generalData.forEach(dataset => {
            this.drawGraphLine(dataset);
        });

        this.createHoveringNet(this.generalData);
        this.createHoveringNet(this.generalData);
    }

    /**
     * Function to draw y axis.
     * @param dataset {D3GeneralDataset} Object with information about the dataset.
     */
    private drawYaxis(options: D3GeneralPlotOptions) {

        // set range offset for y axis scale
        let yRangeOffset = 10;
        const yRange = this.axisOptions.yRange;
        // check for multiple datapoints
        if (yRange.max !== yRange.min) {
            yRangeOffset = (yRange.max - yRange.min) * 0.10;
        } else {
            yRangeOffset = yRange.min * 0.10;
        }

        const yScale = d3.scaleLinear()
            .domain([yRange.min - yRangeOffset, yRange.max + yRangeOffset])
            .range([this.height, 0]);

        const yAxisGen = d3.axisLeft(yScale).ticks(5);

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
            .text(options.ylabel);

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
    private drawXaxis(options: D3GeneralPlotOptions) {
        // set range offset for x axis scale
        const xRange = this.axisOptions.xRange;
        // check for multiple datapoints
        let ticks = 10;
        let xRangeOffset = (xRange.max - xRange.min) * 0.10;
        if (xRange.max === xRange.min) {
            ticks = 5;
            xRangeOffset = xRange.min * 0.10;
        }

        const xScale = d3.scaleLinear()
            .domain([xRange.min - xRangeOffset, xRange.max + xRangeOffset])
            .range([this.buffer, this.width]);

        const xAxis = d3.axisBottom(xScale)
            .ticks(ticks)
            .tickFormat(d => {
                if (options.date) {
                    return this.timeFormatLocaleService.formatTime(d.valueOf());
                } else {
                    return '' + d.valueOf();
                }
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
            .text(options.xlabel);

        return xScale;
    }

    /**
     * Function to draw the line of the graph.
     * @param dataset {D3GeneralDataset} Object with information about the datset.
     */
    private drawGraphLine(dataset: D3GeneralDataset) {
        // create grah line component
        this.graphBody = this.graph
            .append('g')
            .attr('clip-path', 'url(#' + dataset.id + ')');

        // create line with dataset
        const graphLine = d3.line<D3GeneralDataPoint>()
            .defined(d => (!isNaN(d.x) && !isNaN(d.y)))
            .x((d) => {
                const xCoord = this.axisOptions.xScale(d.x);
                if (!isNaN(xCoord)) {
                    d.xCoord = xCoord;
                    return xCoord;
                }
                return undefined;
            })
            .y((d) => {
                const yCoord = this.axisOptions.yScale(d.y);
                if (!isNaN(yCoord)) {
                    d.yCoord = yCoord;
                    return yCoord;
                }
                return undefined;
            })
            .curve(d3.curveLinear);

        this.graphBody
            .append('svg:path')
            .datum(dataset.data)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', this.plotOptions.graph ? this.plotOptions.graph.color : this.defaultGraphOptions.color)
            .attr('stroke-width', this.plotOptions.graph ? this.plotOptions.graph.lines.lineWidth : this.defaultGraphOptions.lines.lineWidth)
            .attr('d', graphLine);

        // draw circles around datapoints
        this.graphBody.selectAll('.graphDots')
            .data(dataset.data.filter((d) => !isNaN(d.y)))
            .enter().append('circle')
            .attr('class', 'graphDots')
            .attr('id', function (d) {
                const datasetxCoordSplit = d.xCoord.toString().split('.')[0] + '-' + d.xCoord.toString().split('.')[1];
                return 'dot-' + datasetxCoordSplit + '-' + dataset.id + '';
            })
            .attr('stroke', this.plotOptions.graph ? this.plotOptions.graph.color : this.defaultGraphOptions.color)
            .attr('fill', this.plotOptions.graph ? this.plotOptions.graph.color : this.defaultGraphOptions.color)
            .attr('cx', graphLine.x())
            .attr('cy', graphLine.y())
            .attr('r', this.plotOptions.graph ? this.plotOptions.graph.lines.pointRadius : this.defaultGraphOptions.lines.pointRadius);

    }

    /**
     * Function to create a net of polygons overlaying the graphs to divide sections for hovering.
     * @param inputData {D3GeneralDataset[]} data containing an array with all datapoints and an id for each dataset
     */
    private createHoveringNet(inputData): void {
        const data = inputData.map(function (series, i) {
            series.data = series.data.map(function (point) {
                point.series = i;
                point[0] = point.x;
                point[1] = point.y;
                return point;
            });
            return series;
        });

        const x = d3.scaleLinear(),
            y = d3.scaleLinear();

        const vertices: [number, number][] = d3.merge(data.map(function (cl, lineIndex) {
            /**
             * cl = { data: [{0: number, 1: number, series: number, x: number, y: number}, {}, ...], id: number }
             * point = each point in a dataset
            */
            const outputLine = cl.data.map(function (point, pointIndex) {
                const outputPoint = [x(point.xCoord), y(point.yCoord), lineIndex, pointIndex, point, cl];
                return outputPoint; // adding series index to point because data is being flattened
            });
            return outputLine;
        }));

        const left = this.buffer, // + this.margin.left,
            top = this.margin.top,
            right = this.background.node().getBBox().width + this.buffer, // + this.margin.left,
            bottom = this.margin.top + this.background.node().getBBox().height;

        // filter dataset - delete all entries that are NaN
        const verticesFiltered = vertices.filter(d => !isNaN(d[0]) || !isNaN(d[1]));
        const Diffvoronoi = d3.voronoi()
            .extent([[left, top], [right, bottom]]);
        const diffVoronoi2 = Diffvoronoi.polygons(verticesFiltered);

        const wrap = this.rawSvg.selectAll('g.d3line').data([verticesFiltered]);
        const gEnter = wrap.enter().append('g').attr('class', 'd3line').append('g');
        gEnter.append('g').attr('class', 'point-paths');

        // to avoid no hovering for only one dataset without interaction the following lines are doubled
        // this will create the paths, which can be updated later on (by the 'exit().remove()' function calls)
        let pointPaths = wrap.select('.point-paths').selectAll('path')
            .data(diffVoronoi2);
        pointPaths
            .enter().append('path')
            .attr('class', function (d, i) {
                return 'path-' + i;
            });

        pointPaths = wrap.select('.point-paths').selectAll('path')
            .data(diffVoronoi2);
        pointPaths
            .enter().append('path')
            .attr('class', function (d, i) {
                return 'path-' + i;
            });
        pointPaths.exit().remove();
        pointPaths
            .attr('clip-path', function (d) {
                if (d !== undefined) {
                    const datasetxCoordSplit = d.data[4].xCoord.toString().split('.')[0] + '-' + d.data[4].xCoord.toString().split('.')[1];
                    return 'url(#clip-' + d.data[5].id + '-' + datasetxCoordSplit + ')';
                }
                return undefined;
            })
            .attr('d', function (d) {
                if (d !== undefined) {
                    return 'M' + d.join(' ') + 'Z';
                }
                return undefined;
            })
            .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')')
            .on('mousemove', (d) => {
                if (d !== undefined) {
                    const coords = d3.mouse(this.background.node());
                    const dataset = d.data[4];
                    const dist = this.calcDistanceHovering(dataset, coords);
                    const radius = this.plotOptions.graph ? this.plotOptions.graph.lines.pointRadius : this.defaultGraphOptions.lines.pointRadius;
                    const color = this.plotOptions.graph ? this.plotOptions.graph.color : this.defaultGraphOptions.color;
                    if (dist <= 8) {
                        const rectBack = this.background.node().getBBox();
                        if (coords[0] >= 0 && coords[0] <= rectBack.width && coords[1] >= 0 && coords[1] <= rectBack.height) {
                            // highlight hovered dot
                            const datasetxCoordSplit = dataset.xCoord.toString().split('.')[0] + '-' + dataset.xCoord.toString().split('.')[1];
                            d3.select('#dot-' + datasetxCoordSplit + '-' + d.data[5].id + '')
                                .attr('opacity', 0.8)
                                .attr('r', (radius * 2));

                            this.highlightRect
                                .style('visibility', 'visible');
                            this.highlightText
                                .style('visibility', 'visible');

                            // create text for hovering label
                            const text = this.plotOptions.date ? 'x: ' + moment(dataset.x).format('DD.MM.YY HH:mm') + ' y: ' + dataset.y : 'x: ' + dataset.x + ' y: ' + dataset.y;
                            const dotLabel = this.highlightText
                                .text(text)
                                .attr('class', 'mouseHoverDotLabel')
                                .style('pointer-events', 'none')
                                .style('fill', color);

                            let onLeftSide = false;
                            if ((this.background.node().getBBox().width + this.buffer) / 2 > coords[0]) { onLeftSide = true; }

                            let rectX: number = dataset.xCoord + 15;
                            let rectY: number = dataset.yCoord;
                            const rectW: number = this.getDimensions(dotLabel.node()).w + 8;
                            const rectH: number = this.getDimensions(dotLabel.node()).h; // + 4;

                            if (!onLeftSide) {
                                rectX = dataset.xCoord - 15 - rectW;
                                rectY = dataset.yCoord;
                            }

                            if ((coords[1] + rectH + 4) > this.background.node().getBBox().height) {
                                // when label below x axis
                                console.log('Translate label to a higher place. - not yet implemented');
                            }

                            // create hovering label
                            const dotRectangle = this.highlightRect
                                .attr('class', 'mouseHoverDotRect')
                                .style('fill', 'white')
                                .style('fill-opacity', 1)
                                .style('stroke', color)
                                .style('stroke-width', '1px')
                                .style('pointer-events', 'none')
                                .attr('width', rectW)
                                .attr('height', rectH)
                                .attr('transform', 'translate(' + rectX + ', ' + rectY + ')');

                            let labelX: number = dataset.xCoord + 4 + 15;
                            let labelY: number = dataset.yCoord + this.getDimensions(dotRectangle.node()).h - 4;

                            if (!onLeftSide) {
                                labelX = dataset.xCoord - rectW + 4 - 15;
                                labelY = dataset.yCoord + this.getDimensions(dotRectangle.node()).h - 4;
                            }

                            this.highlightText
                                .attr('transform', 'translate(' + labelX + ', ' + labelY + ')');
                        }
                    } else {
                        // unhighlight hovered dot
                        const datasetxCoordSplit = dataset.xCoord.toString().split('.')[0] + '-' + dataset.xCoord.toString().split('.')[1];
                        d3.select('#dot-' + datasetxCoordSplit + '-' + d.data[5].id + '')
                            .attr('opacity', 1)
                            .attr('r', radius);

                        // make label invisible
                        this.highlightRect
                            .style('visibility', 'hidden');
                        this.highlightText
                            .style('visibility', 'hidden');
                    }
                }
            })
            .on('mouseout', (d) => {
                if (d !== undefined) {
                    const dataset = d.data[4];
                    const radius = this.plotOptions.graph ? this.plotOptions.graph.lines.pointRadius : this.defaultGraphOptions.lines.pointRadius;
                    // unhighlight hovered dot
                    const datasetxCoordSplit = dataset.xCoord.toString().split('.')[0] + '-' + dataset.xCoord.toString().split('.')[1];
                    d3.select('#dot-' + datasetxCoordSplit + '-' + d.data[5].id + '')
                        .attr('opacity', 1)
                        .attr('r', radius);

                    // make label invisible
                    this.highlightRect
                        .style('visibility', 'hidden');
                    this.highlightText
                        .style('visibility', 'hidden');
                }
            });
    }

    /**
     * Function to calculate distance between mouse and a hovered point.
     * @param dataset {} Coordinates of the hovered point.
     * @param coords {} Coordinates of the mouse.
     */
    private calcDistanceHovering(dataset: D3GeneralDataPoint, coords: [number, number]): number {
        const mX = coords[0] + this.buffer,
            mY = coords[1], // + this.margin.top,
            pX = dataset.xCoord,
            pY = dataset.yCoord;
        // calculate distance between point and mouse when hovering
        return Math.sqrt(Math.pow((pX - mX), 2) + Math.pow((pY - mY), 2));
    }

    private getRange(data: D3GeneralDataPoint[], selector: string): Range {
        // range for axis scale
        const range: [number, number] = d3.extent(d3.values(data.map((d) => {
            if ((!isNaN(d.x) && !isNaN(d.y))) {
                return d[selector];
            }
        })));
        return { min: range[0], max: range[1] };
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
