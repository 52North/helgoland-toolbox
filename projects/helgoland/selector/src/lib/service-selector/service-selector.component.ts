import { Component, OnInit, inject, input, output } from '@angular/core';
import {
  BlacklistedService,
  DatasetApi,
  HelgolandParameterFilter,
  HelgolandService,
} from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { ServiceSelectorService } from './service-selector.service';

interface ExtendedHelgolandService extends HelgolandService {
  protected?: boolean;
}

/**
 * Component to select an item out of a list of provider with a given filter combination.
 */
@Component({
  selector: 'n52-service-selector',
  templateUrl: './service-selector.component.html',
  styleUrls: ['./service-selector.component.scss'],
  imports: [CommonModule, TranslateModule],
})
export class ServiceSelectorComponent implements OnInit {
  protected serviceSelectorService = inject(ServiceSelectorService);

  public readonly datasetApiList = input<DatasetApi[]>([]);

  public readonly providerBlacklist = input<BlacklistedService[]>([]);

  public readonly supportStations = input<boolean>(); // TODO: needed???

  public readonly selectedService = input<HelgolandService>();

  public readonly filter = input<HelgolandParameterFilter>({});

  public readonly showUnresolvableServices = input<boolean>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onServiceSelected = output<HelgolandService>();

  public services: ExtendedHelgolandService[] = [];
  public unResolvableServices: DatasetApi[] = [];
  public loadingCount = 0;

  public ngOnInit() {
    const datasetApiList = this.datasetApiList();
    if (datasetApiList) {
      this.loadingCount = datasetApiList.length;
      this.services = [];
      this.unResolvableServices = [];
      datasetApiList.forEach((api) => {
        this.serviceSelectorService
          .fetchServicesOfAPI(api.url, this.providerBlacklist(), this.filter())
          .subscribe({
            next: (res) => {
              this.loadingCount--;
              if (res && res instanceof Array) {
                res.forEach((entry) => {
                  const filter = this.filter();
                  if (
                    entry.quantities?.datasets ||
                    (filter && !filter.expanded)
                  ) {
                    this.services.push(entry);
                  }
                });
              } else {
                this.loadingCount--;
                this.services.push({
                  apiUrl: api.url,
                  label: api.name,
                  protected: true,
                  id: api.url,
                  type: '',
                  version: '',
                });
              }
            },
            error: (error) => {
              this.unResolvableServices.push(api);
              this.loadingCount--;
            },
          });
      });
    }
  }

  public isSelected(service: HelgolandService) {
    const selectedService = this.selectedService();
    if (!selectedService) {
      return false;
    }
    return (
      selectedService.id === service.id &&
      selectedService.apiUrl === service.apiUrl
    );
  }

  public selectService(service: HelgolandService) {
    this.onServiceSelected.emit(service);
  }
}
