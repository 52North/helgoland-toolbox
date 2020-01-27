import { ParameterConstellation } from '../../../model/dataset-api/dataset';

export class HelgolandPlatform {

    constructor(
        public id: string,
        public label: string,
        public datasets: {
            [key: string]: ParameterConstellation;
        },
        public geometry?: GeoJSON.GeometryObject
    ) { }

}
