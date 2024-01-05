export class HelgolandPlatform {
  constructor(
    public id: string,
    public label: string,
    public datasetIds: string[],
    public geometry?: GeoJSON.GeometryObject,
  ) {}
}
