import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Filter, HelgolandServicesHandlerService, LanguageChangNotifier, Parameter, ParameterFilter } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

export interface MultiServiceFilter {
    url: string;
    filter?: ParameterFilter;
}

export enum MultiServiceFilterEndpoint {
    offering = 'offering',
    phenomenon = 'phenomenon',
    procedure = 'procedure',
    feature = 'feature',
    category = 'category',
    platform = 'platform',
    dataset = 'dataset'
}

/**
 * Component to select an item out of a list of provider with a given filter combination.
 */
@Component({
    selector: 'n52-multi-service-filter-selector',
    templateUrl: './multi-service-filter-selector.component.html'
})
export class MultiServiceFilterSelectorComponent extends LanguageChangNotifier implements OnChanges {

    @Input()
    public endpoint: MultiServiceFilterEndpoint;

    @Input()
    public filterList: MultiServiceFilter[];

    @Output()
    public onItemSelected: EventEmitter<FilteredParameter> = new EventEmitter<FilteredParameter>();

    public loading = 0;
    public items: FilteredParameter[];

    constructor(
        protected servicesHandler: HelgolandServicesHandlerService,
        protected translate: TranslateService
    ) {
        super(translate);
    }

    public ngOnChanges() {
        this.loadItems();
    }

    public onSelectItem(item: FilteredParameter): void {
        this.onItemSelected.emit(item);
    }

    protected languageChanged(): void {
        this.loadItems();
    }

    private loadItems() {
        this.items = [];
        this.filterList.forEach((entry) => {
            this.loading++;
            const filter = entry.filter || {};
            switch (this.endpoint) {
                case MultiServiceFilterEndpoint.offering:
                    this.servicesHandler.getOfferings(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, filter.service),
                        (error) => this.errorOnLoading
                    );
                    break;
                case MultiServiceFilterEndpoint.phenomenon:
                    this.servicesHandler.getPhenomena(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, filter.service),
                        (error) => this.errorOnLoading
                    );
                    break;
                case MultiServiceFilterEndpoint.procedure:
                    this.servicesHandler.getProcedures(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, filter.service),
                        (error) => this.errorOnLoading
                    );
                    break;
                case MultiServiceFilterEndpoint.feature:
                    this.servicesHandler.getFeatures(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, filter.service),
                        (error) => this.errorOnLoading
                    );
                    break;
                case MultiServiceFilterEndpoint.category:
                    this.servicesHandler.getCategories(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, filter.service),
                        (error) => this.errorOnLoading
                    );
                    break;
                case MultiServiceFilterEndpoint.platform:
                    this.servicesHandler.getStations(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, filter.service),
                        (error) => this.errorOnLoading
                    );
                    break;
                case MultiServiceFilterEndpoint.dataset:
                    this.servicesHandler.getDatasets(entry.url, filter).subscribe(
                        res => this.setItems(res, filter, entry.url, filter.service),
                        error => this.errorOnLoading
                    );
                    break;
                default:
                    console.error('Wrong endpoint: ' + this.endpoint);
                    this.loading--;
            }
        });
    }

    private errorOnLoading(): void {
        this.loading--;
    }

    private setItems(res: FilteredParameter[], prevfilter: ParameterFilter, url: string, service: string): void {
        this.loading--;
        res.forEach((entry) => {
            const filter: Filter = {
                filter: prevfilter,
                itemId: entry.id,
                url,
                service
            };
            const item = this.items.find((elem) => {
                if (elem.label === entry.label) { return true; }
            });
            if (item) {
                item.filterList.push(filter);
            } else {
                entry.filterList = [filter];
                this.items.push(entry);
            }
        });
    }

}

export interface FilteredParameter extends Parameter {
    filterList?: Filter[];
}
