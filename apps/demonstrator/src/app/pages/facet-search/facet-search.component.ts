import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatasetType, HelgolandPlatform, HelgolandServicesConnector, HelgolandTimeseries, Timeseries, Timespan } from '@helgoland/core';
import { FacetSearchService, ParameterFacetSort, ParameterFacetType } from '@helgoland/facet-search';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'n52-facet-search',
  templateUrl: './facet-search.component.html',
  styleUrls: ['./facet-search.component.scss']
})
export class FacetSearchComponent {

  public timeseries: Timeseries[];

  public categoryType: ParameterFacetType = ParameterFacetType.category;
  public featureType: ParameterFacetType = ParameterFacetType.feature;
  public offeringType: ParameterFacetType = ParameterFacetType.offering;
  public phenomenonType: ParameterFacetType = ParameterFacetType.phenomenon;
  public procedureType: ParameterFacetType = ParameterFacetType.procedure;

  public featureSort: ParameterFacetSort = ParameterFacetSort.ascAlphabet;

  public categoryAutocomplete: string;
  public featureAutocomplete: string;
  public offeringAutocomplete: string;
  public phenomenonAutocomplete: string;
  public procedureAutocomplete: string;

  public resultCount: number;
  public showMap = true;
  public resetAllDisabled: boolean;

  public selectedStart: Date;
  public selectedEnd: Date;

  constructor(
    private servicesConnector: HelgolandServicesConnector,
    private translate: TranslateService,
    public facetSearch: FacetSearchService
  ) {
    this.translate.onLangChange.subscribe(_ => {
      this.fetchDatasets();
    });

    this.facetSearch.getResults().subscribe(ts => {
      this.resultCount = ts.length;
      this.fetchTime();
      this.resetAllDisabled = !this.facetSearch.areFacetsSelected();
    });
  }

  private fetchDatasets() {
    forkJoin([
      this.servicesConnector.getDatasets('mocked-apiv3', { expanded: true, type: DatasetType.Timeseries }),
      // this.servicesConnector.getDatasets('http://192.168.52.242:8080/52n-sos-webapp/api/', { expanded: true, type: DatasetType.Timeseries }),
      // this.servicesHandler.getDatasets('http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/', { expanded: true, type: DatasetType.Timeseries }),
      // this.servicesHandler.getDatasets('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/',
      //   { expanded: true, service: 'srv_3dec8ce040d9506c5aba685c9d134156', type: DatasetType.Timeseries }
      // ),
      // this.servicesHandler.getDatasets('https://geo.irceline.be/sos/api/v1/', { expanded: true, type: DatasetType.Timeseries }),
      // this.servicesHandler.getDatasets('http://monalisasos.eurac.edu/sos/api/v1/', { expanded: true, type: DatasetType.Timeseries }),
    ]).subscribe(res => {
      const complete = [];
      res.forEach(dsList => {
        dsList.forEach(ds => {
          if (ds instanceof HelgolandTimeseries) {
            complete.push(ds);
          }
        });
      });
      this.facetSearch.setTimeseries(complete);
    });
  }

  public onSelectedTs(ts: HelgolandTimeseries | { station: HelgolandPlatform; url: string; }) {
    console.log(`${ts} is clicked`);
  }

  public toggleResultView() {
    this.showMap = !this.showMap;
  }

  public resetAllFacets() {
    this.facetSearch.resetAllFacets();
  }

  public setStart(start: MatDatepickerInputEvent<Date>) {
    this.facetSearch.setSelectedTimespan(new Timespan(start.value, this.selectedEnd));
  }

  public setEnd(end: MatDatepickerInputEvent<Date>) {
    this.facetSearch.setSelectedTimespan(new Timespan(this.selectedStart, end.value));
  }

  public setAutocomplete(acString: string, evt: any) {
    acString = evt.target.value;
  }

  private fetchTime() {
    const timespan = this.facetSearch.getFilteredTimespan();
    if (timespan) {
      this.selectedStart = new Date(timespan.from);
      this.selectedEnd = new Date(timespan.to);
    }
  }

}
