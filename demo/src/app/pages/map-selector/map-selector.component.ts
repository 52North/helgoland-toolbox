import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: './map-selector.component.html',
    styleUrls: ['./map-selector.component.css']
})
export class MapSelectorComponent {

    public providerUrl = 'http://www.fluggs.de/sos2/api/v1/';

    public switchProvider() {
        if (this.providerUrl === 'http://www.fluggs.de/sos2/api/v1/') {
            this.providerUrl = 'http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/';
        } else {
            this.providerUrl = 'http://www.fluggs.de/sos2/api/v1/';
        }
    }
}
