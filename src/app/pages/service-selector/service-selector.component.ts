import { Component } from '@angular/core';
import { DatasetApi, ParameterFilter, PlatformTypes, ValueTypes } from '@helgoland/core';

@Component({
    templateUrl: './service-selector.component.html',
    styleUrls: ['./service-selector.component.css']
})
export class ServiceSelectorComponent {
    public datasetApis: DatasetApi[] = [
        {
            name: 'UPC-SOS',
            url: 'http://nexos.dev.52north.org/52n-sos-upc/api/'
        },
        {
            name: 'nexos.demo.52north',
            url: 'http://nexos.demo.52north.org/52n-sos-nexos-test/api/'
        },
        {
            name: 'codm.hzg.de',
            url: 'http://codm.hzg.de/52n-sos-webapp/api/v1/'
        },
        {
            name: 'sensorwebclient-webapp-stable',
            url: 'http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/'
        },
        {
            name: 'geo.irceline.be',
            url: 'http://geo.irceline.be/sos/api/v1/'
        },
        {
            name: 'fluggs.de',
            url: 'https://www.fluggs.de/sos2/api/v1/'
        },
        {
            name: '52north - Sensorwebtestbed',
            url: 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/'
        },
        {
            name: 'inspire.rivm.nl',
            url: 'http://inspire.rivm.nl/sos/eaq/api/v1/'
        },
        {
            name: 'Monalisa-Sos',
            url: 'http://monalisasos.eurac.edu/sos/api/v1/'
        }
    ];

    public providerFilter: ParameterFilter = {
        platformTypes: PlatformTypes.stationary,
        valueTypes: ValueTypes.quantity
    };
}
