import { ScaleLinear } from 'd3';

// input tyoe for d3-general-graph component
export interface D3GeneralDatasetInput {
    data: D3GeneralDataPoint[];
    xlabel: string;
    ylabel: string;
}

// dataset type inside d3-general-graph component
export interface D3GeneralDataset {
    data: D3GeneralDataPoint[];
    plotOptions: {
        xlabel: string;
        ylabel: string;
        xScale?: ScaleLinear<number, number>;
        yScale?: ScaleLinear<number, number>;
    };
}

export interface D3GeneralDataPoint {
    x: number;
    y: number;
}
