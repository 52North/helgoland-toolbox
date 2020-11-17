import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FilteredProvider, HelgolandDataset, HelgolandParameterFilter, HelgolandServicesConnector } from '@helgoland/core';

import {
    FilteredParameter,
    MultiServiceFilter,
} from '../multi-service-filter-selector/multi-service-filter-selector.component';
import { ListSelectorParameter, ListSelectorService } from './list-selector.service';

/**
 * Component to select an item out of a list of provider with a given filter combination.
 */
@Component({
    selector: 'n52-list-selector',
    templateUrl: './list-selector.component.html'
})
export class ListSelectorComponent implements OnChanges {

    @Input()
    public parameters: ListSelectorParameter[];

    @Input()
    public filter: HelgolandParameterFilter;

    @Input()
    public providerList: FilteredProvider[];

    @Input()
    public selectorId: string;

    @Output()
    public onDatasetSelection: EventEmitter<HelgolandDataset[]> = new EventEmitter<HelgolandDataset[]>();

    public activePanel: string;

    constructor(
        protected listSelectorService: ListSelectorService,
        protected servicesConnector: HelgolandServicesConnector
    ) { }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.providerList && changes.providerList.currentValue) {
            if (this.selectorId && this.listSelectorService.cache.has(this.selectorId)
                && this.isEqual(this.providerList, this.listSelectorService.providerList)) {
                this.parameters = this.listSelectorService.cache.get(this.selectorId);
                let idx = this.parameters.findIndex((entry) => entry.isDisabled);
                if (idx === -1) {
                    idx = this.parameters.length;
                }
                this.activePanel = this.selectorId + '-' + (idx - 1);
                this.parameters[idx - 1].filterList.forEach(e => delete e.filter[this.parameters[idx - 1].type]);
            } else {
                if (this.selectorId) {
                    this.listSelectorService.cache.set(this.selectorId, this.parameters);
                }
                // create filterlist for first parameter entry
                this.parameters[0].filterList = this.providerList.map((entry) => {
                    return {
                        url: entry.url,
                        filter: { service: entry.id }
                    };
                }) as MultiServiceFilter[];
                this.listSelectorService.providerList = this.providerList;
                // open first tab
                this.activePanel = this.selectorId + '-0';
                this.parameters[0].isDisabled = false;
                // disable parameterList
                for (let i = 1; i < this.parameters.length; i++) {
                    this.parameters[i].isDisabled = true;
                    this.parameters[i].headerAddition = '';
                }
            }
        }
    }

    public itemSelected(item: FilteredParameter, index: number) {
        if (index < this.parameters.length - 1) {
            this.parameters[index].headerAddition = item.label;
            this.parameters[index].selected = item.label;
            this.activePanel = this.selectorId + '-' + (index + 1);
            this.parameters[index + 1].isDisabled = false;
            // copy filter to new item
            this.parameters[index + 1].filterList = JSON.parse(JSON.stringify(item.filterList));
            // add filter for selected item to next
            this.parameters[index + 1].filterList.forEach((entry) => entry.filter[this.parameters[index].type] = entry.itemId);
            for (let i = index + 2; i < this.parameters.length; i++) {
                this.parameters[i].isDisabled = true;
                this.parameters[i].filterList = [];
            }
            for (let j = index + 1; j < this.parameters.length; j++) {
                this.parameters[j].headerAddition = '';
                this.parameters[j].selected = '';
            }
        } else {
            item.filterList.forEach((entry) => {
                entry.filter[this.parameters[index].type] = entry.itemId;
                this.openDataset(entry.url, entry.filter);
            });
        }
    }

    private openDataset(url: string, params: HelgolandParameterFilter) {
        this.servicesConnector.getDatasets(url, params).subscribe(result => this.onDatasetSelection.emit(result));
    }

    private isEqual(listOne: FilteredProvider[], listTwo: FilteredProvider[]): boolean {
        let match = true;
        if (listOne.length === listTwo.length) {
            listOne.forEach((entryOne) => {
                const found = listTwo.find((entryTwo) => {
                    if (entryOne.id === entryTwo.id && entryOne.url === entryTwo.url) { return true; }
                    return false;
                });
                if (!found) { match = false; }
            });
        } else {
            match = false;
        }
        return match;
    }
}
