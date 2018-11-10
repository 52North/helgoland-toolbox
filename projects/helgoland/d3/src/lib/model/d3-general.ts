
export interface D3GeneralDataset {
    data: D3GeneralDataPoint[];
    plotOptions: {
        xlabel: string;
        ylabel: string;
        xScale?: d3.ScaleLinear<number, number>;
        yScale?: d3.ScaleLinear<number, number>;
    };
}

export interface D3GeneralDataPoint {
    x: number;
    y: number;
}
