export class HelgolandStation {

    public id: string;
    public label: string;
    public geometry: GeoJSON.GeometryObject;

    constructor(id: string, label: string, geometry: GeoJSON.GeometryObject) {
        this.id = id;
        this.label = label;
        this.geometry = geometry;
    }

}

// export class HelgolandStationFilter {

//     public phenomenon: string;

// }
