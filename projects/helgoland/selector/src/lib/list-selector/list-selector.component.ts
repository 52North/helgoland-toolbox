// @ts-nocheck
// seems to be unused
import {
  Component,
  OnChanges,
  SimpleChanges,
  inject,
  input,
  output,
} from '@angular/core';
import {
  FilteredProvider,
  HelgolandDataset,
  HelgolandParameterFilter,
  HelgolandServicesConnector,
} from '@helgoland/core';

import {
  FilteredParameter,
  MultiServiceFilter,
  MultiServiceFilterSelectorComponent,
} from '../multi-service-filter-selector/multi-service-filter-selector.component';
import {
  ListSelectorParameter,
  ListSelectorService,
} from './list-selector.service';

/**
 * Component to select an item out of a list of provider with a given filter combination.
 */
@Component({
  selector: 'n52-list-selector',
  templateUrl: './list-selector.component.html',
  imports: [MultiServiceFilterSelectorComponent],
})
export class ListSelectorComponent implements OnChanges {
  protected listSelectorService = inject(ListSelectorService);
  protected servicesConnector = inject(HelgolandServicesConnector);

  readonly parameters = input<ListSelectorParameter[]>();

  readonly filter = input<HelgolandParameterFilter>({});

  readonly providerList = input<FilteredProvider[]>();

  readonly selectorId = input<string>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onDatasetSelection = output<HelgolandDataset[]>();

  activePanel: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['providerList'] && changes['providerList'].currentValue) {
      const selectorId = this.selectorId();
      const providerList = this.providerList();
      if (
        selectorId &&
        this.listSelectorService.cache.has(selectorId) &&
        this.isEqual(providerList, this.listSelectorService.providerList)
      ) {
        this.parameters = this.listSelectorService.cache.get(selectorId);
        let idx = this.parameters().findIndex((entry) => entry.isDisabled);
        if (idx === -1) {
          idx = this.parameters().length;
        }
        this.activePanel = selectorId + '-' + (idx - 1);
        this.parameters()[idx - 1].filterList.forEach(
          (e) => delete e.filter[this.parameters()[idx - 1].type],
        );
      } else {
        const parameters = this.parameters();
        if (selectorId) {
          this.listSelectorService.cache.set(selectorId, parameters);
        }
        // create filterlist for first parameter entry
        parameters[0].headerAddition = '';
        parameters[0].selected = '';
        parameters[0].filterList = providerList.map((entry) => {
          const filter: HelgolandParameterFilter = {};
          if (entry.id) {
            filter.service = entry.id;
          }
          const filterValue = this.filter();
          if (filterValue.type) {
            filter.type = filterValue.type;
          }
          return {
            url: entry.url,
            filter,
          };
        }) as MultiServiceFilter[];
        this.listSelectorService.providerList = providerList;
        // open first tab
        this.activePanel = selectorId + '-0';
        parameters[0].isDisabled = false;
        // disable parameterList
        for (let i = 1; i < parameters.length; i++) {
          parameters[i].isDisabled = true;
          parameters[i].headerAddition = '';
        }
      }
    }
  }

  itemSelected(item: FilteredParameter, index: number) {
    if (index < this.parameters().length - 1) {
      parameters[index].headerAddition = item.label;
      parameters[index].selected = item.label;
      this.activePanel = this.selectorId() + '-' + (index + 1);
      parameters[index + 1].isDisabled = false;
      // copy filter to new item
      parameters[index + 1].filterList = JSON.parse(
        JSON.stringify(item.filterList),
      );
      // add filter for selected item to next
      parameters[index + 1].filterList.forEach(
        (entry) => (entry.filter[this.parameters()[index].type] = entry.itemId),
      );
      for (let i = index + 2; i < parameters.length; i++) {
        parameters[i].isDisabled = true;
        parameters[i].filterList = [];
      }
      for (let j = index + 1; j < parameters.length; j++) {
        parameters[j].headerAddition = '';
        parameters[j].selected = '';
      }
    } else {
      item.filterList.forEach((entry) => {
        entry.filter[this.parameters()[index].type] = entry.itemId;
        this.openDataset(entry.url, entry.filter);
      });
    }
  }

  private openDataset(url: string, params: HelgolandParameterFilter) {
    this.servicesConnector
      .getDatasets(url, params)
      .subscribe((result) => this.onDatasetSelection.emit(result));
  }

  private isEqual(
    listOne: FilteredProvider[],
    listTwo: FilteredProvider[],
  ): boolean {
    let match = true;
    if (listOne.length === listTwo.length) {
      listOne.forEach((entryOne) => {
        const found = listTwo.find((entryTwo) => {
          if (entryOne.id === entryTwo.id && entryOne.url === entryTwo.url) {
            return true;
          }
          return false;
        });
        if (!found) {
          match = false;
        }
      });
    } else {
      match = false;
    }
    return match;
  }
}
