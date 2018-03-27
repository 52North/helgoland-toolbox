import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: './service-selector.component.html',
    styleUrls: ['./service-selector.component.css']
})
export class ServiceSelectorComponent {
    public providerList = [
        'http://nexos.dev.52north.org/52n-sos-upc/api/',
        'http://nexos.demo.52north.org/52n-sos-nexos-test/api/',
        'http://codm.hzg.de/52n-sos-webapp/api/v1/',
        'http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/',
        'http://geo.irceline.be/sos/api/v1/',
        'https://www.fluggs.de/sos2/api/v1/',
        'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/',
        'http://inspire.rivm.nl/sos/eaq/api/v1/',
        'http://monalisasos.eurac.edu/sos/api/v1/'
    ];
}
