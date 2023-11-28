import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BlacklistedService, DatasetApi, HelgolandParameterFilter, HelgolandService } from "@helgoland/core";

import { ServiceSelectorService } from "./service-selector.service";
import { TranslateModule } from "@ngx-translate/core";
import { NgClass } from "@angular/common";

interface ExtendedHelgolandService extends HelgolandService {
    protected?: boolean;
}

/**
 * Component to select an item out of a list of provider with a given filter combination.
 */
@Component({
  selector: "n52-service-selector",
  templateUrl: "./service-selector.component.html",
  styleUrls: ["./service-selector.component.scss"],
  standalone: true,
  imports: [NgClass, TranslateModule]
})
export class ServiceSelectorComponent implements OnInit {

    @Input()
  public datasetApiList: DatasetApi[] = [];

    @Input()
    public providerBlacklist: BlacklistedService[] = [];

    @Input()
    public supportStations: boolean | undefined; // TODO: needed???

    @Input()
    public selectedService: HelgolandService | undefined;

    @Input()
    public filter: HelgolandParameterFilter = {};

    @Input()
    public showUnresolvableServices: boolean | undefined;

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onServiceSelected: EventEmitter<HelgolandService> = new EventEmitter<HelgolandService>();

    public services: ExtendedHelgolandService[] = [];
    public unResolvableServices: DatasetApi[] = [];
    public loadingCount = 0;

    constructor(
        protected serviceSelectorService: ServiceSelectorService
    ) { }

    public ngOnInit() {
      if (!this.filter) { this.filter = {}; }
      if (!this.providerBlacklist) { this.providerBlacklist = []; }
      if (this.datasetApiList) {
        this.loadingCount = this.datasetApiList.length;
        this.services = [];
        this.unResolvableServices = [];
        this.datasetApiList.forEach((api) => {
          if (!api.basicAuth) {
            this.serviceSelectorService.fetchServicesOfAPI(api.url, this.providerBlacklist, this.filter)
              .subscribe(
                (res) => {
                  this.loadingCount--;
                  if (res && res instanceof Array) {
                    res.forEach((entry) => {
                      if (entry.quantities?.datasets) {
                        this.services.push(entry);
                      }
                    });
                  }
                  this.services.sort((a, b) => {
                    if (a.label < b.label) { return -1; }
                    if (a.label > b.label) { return 1; }
                    return 0;
                  });
                },
                (error) => {
                  this.unResolvableServices.push(api);
                  this.loadingCount--;
                });
          } else {
            this.loadingCount--;
            this.services.push({
              apiUrl: api.url,
              label: api.name,
              protected: true,
              id: api.url,
              type: "",
              version: ""
            })
          }
        });
      }
    }

    public isSelected(service: HelgolandService) {
      if (!this.selectedService) { return false; }
      return this.selectedService.id === service.id && this.selectedService.apiUrl === service.apiUrl;
    }

    public selectService(service: HelgolandService) {
      this.onServiceSelected.emit(service);
    }
}
