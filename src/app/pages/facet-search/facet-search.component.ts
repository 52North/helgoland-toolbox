import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import {
  ApiV3InterfaceService,
  DatasetType,
  HelgolandServicesConnector,
  HelgolandTimeseries,
  Timeseries,
  Timespan,
} from '@helgoland/core';
import {
  convertToFacetEntry,
  FacetSearchElement,
  FacetSearchElementFeature,
  FacetSearchService,
  HelgolandFacetSearchModule,
  ParameterFacetSort,
  ParameterFacetType,
} from '@helgoland/facet-search';
import { MapCache } from '@helgoland/map';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'n52-facet-search',
  templateUrl: './facet-search.component.html',
  styleUrls: ['./facet-search.component.scss'],
  imports: [
    HelgolandFacetSearchModule,
    MatDatepickerModule,
    CommonModule
  ],
  providers: [
    MapCache
  ],
  standalone: true
})
export class FacetSearchComponent {

  public timeseries: Timeseries[];

  public categoryType: ParameterFacetType = ParameterFacetType.category;
  public featureType: ParameterFacetType = ParameterFacetType.feature;
  public offeringType: ParameterFacetType = ParameterFacetType.offering;
  public phenomenonType: ParameterFacetType = ParameterFacetType.phenomenon;
  public procedureType: ParameterFacetType = ParameterFacetType.procedure;

  public featureSort: ParameterFacetSort = ParameterFacetSort.descCount;

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
    private apiv3: ApiV3InterfaceService,
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
      // this.servicesConnector.getDatasets('mocked-apiv3', { expanded: true, type: DatasetType.Timeseries }),
      // this.servicesConnector.getDatasets('http://192.168.52.242:8080/52n-sos-webapp/api/', { expanded: true, type: DatasetType.Timeseries }),
      // this.servicesHandler.getDatasets('http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/', { expanded: true, type: DatasetType.Timeseries }),
      // this.servicesHandler.getDatasets('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/',
      //   { expanded: true, service: 'srv_3dec8ce040d9506c5aba685c9d134156', type: DatasetType.Timeseries }
      // ),
      // this.servicesHandler.getDatasets('https://geo.irceline.be/sos/api/v1/', { expanded: true, type: DatasetType.Timeseries }),
      // this.servicesHandler.getDatasets('http://monalisasos.eurac.edu/sos/api/v1/', { expanded: true, type: DatasetType.Timeseries }),
      this.servicesConnector.getDatasets('https://fluggs.wupperverband.de/sws5/api/', { expanded: true, type: DatasetType.Timeseries })
    ]).subscribe(res => {
      const complete: FacetSearchElement[] = [];
      res.forEach(dsList => {
        dsList.forEach(ds => {
          if (ds instanceof HelgolandTimeseries) {
            complete.push(convertToFacetEntry(ds));
          }
        });
      });
      this.facetSearch.setEntries(complete);
    });


    // const url = 'http://192.168.52.242:8080/52n-sos-webapp/api/';
    // const filter: ApiV3ParameterFilter = {
    //   expanded: true,
    //   select: ['label', 'parameters/procedure', 'parameters/phenomenon', 'parameters/category', 'feature']
    // }
    // this.apiv3.getDatasets(url, filter).subscribe(res => {
    //   const entries: FacetSearchElement[] = res.map(e => convertFromApiV3Dataset(e, url));
    //   console.log(entries[0]);
    //   this.facetSearch.setEntries(entries);
    // })
  }

  public onSelectedEntry(entry: FacetSearchElement) {
    console.log(entry);
  }

  public onSelectedFeature(elem: { feature: FacetSearchElementFeature, url: string }) {
    console.log(elem);
  }

  public toggleResultView() {
    this.showMap = !this.showMap;
  }

  public resetAllFacets() {
    this.facetSearch.resetAllFacets();
  }

  public setStart(start: MatDatepickerInputEvent<Date>) {
    if (start.value)
      this.facetSearch.setSelectedTimespan(new Timespan(start.value, this.selectedEnd));
  }

  public setEnd(end: MatDatepickerInputEvent<Date>) {
    if (end.value)
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
