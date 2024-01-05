import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  Filter,
  HelgolandParameterFilter,
  HelgolandServicesConnector,
  LanguageChangNotifier,
  Parameter,
  Required,
} from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import { NgStyle } from '@angular/common';

export interface MultiServiceFilter {
  url: string;
  itemId?: string;
  filter?: HelgolandParameterFilter;
}

export enum MultiServiceFilterEndpoint {
  offering = 'offering',
  phenomenon = 'phenomenon',
  procedure = 'procedure',
  feature = 'feature',
  category = 'category',
  platform = 'platform',
  dataset = 'dataset',
}

/**
 * Component to select an item out of a list of provider with a given filter combination.
 */
@Component({
  selector: 'n52-multi-service-filter-selector',
  templateUrl: './multi-service-filter-selector.component.html',
  standalone: true,
  imports: [NgStyle],
})
export class MultiServiceFilterSelectorComponent
  extends LanguageChangNotifier
  implements OnChanges
{
  @Input()
  @Required
  public endpoint!: MultiServiceFilterEndpoint;

  @Input()
  public filterList: MultiServiceFilter[] = [];

  @Input()
  public selected: string | undefined;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onItemSelected: EventEmitter<FilteredParameter> =
    new EventEmitter<FilteredParameter>();

  public loading = 0;
  public items: FilteredParameter[] = [];

  constructor(
    protected servicesConnector: HelgolandServicesConnector,
    protected override translate: TranslateService,
  ) {
    super(translate);
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['filterList'] && this.filterList) {
      this.loadItems();
    }
  }

  public onSelectItem(item: FilteredParameter): void {
    this.deselectAllItems();
    item.selected = true;
    this.onItemSelected.emit(item);
  }

  protected languageChanged(): void {
    this.loadItems();
  }

  protected loadItems() {
    this.items = [];
    this.filterList.forEach((entry) => {
      const filter = entry.filter || {};
      this.loading++;
      switch (this.endpoint) {
        case MultiServiceFilterEndpoint.offering:
          this.servicesConnector.getOfferings(entry.url, filter).subscribe(
            (res) => this.setItems(res, filter, entry.url, filter.service),
            (error) => this.errorOnLoading(),
          );
          break;
        case MultiServiceFilterEndpoint.phenomenon:
          this.servicesConnector.getPhenomena(entry.url, filter).subscribe(
            (res) => this.setItems(res, filter, entry.url, filter.service),
            (error) => this.errorOnLoading(),
          );
          break;
        case MultiServiceFilterEndpoint.procedure:
          this.servicesConnector.getProcedures(entry.url, filter).subscribe(
            (res) => this.setItems(res, filter, entry.url, filter.service),
            (error) => this.errorOnLoading(),
          );
          break;
        case MultiServiceFilterEndpoint.feature:
          this.servicesConnector.getFeatures(entry.url, filter).subscribe(
            (res) => this.setItems(res, filter, entry.url, filter.service),
            (error) => this.errorOnLoading(),
          );
          break;
        case MultiServiceFilterEndpoint.category:
          this.servicesConnector.getCategories(entry.url, filter).subscribe(
            (res) => this.setItems(res, filter, entry.url, filter.service),
            (error) => this.errorOnLoading(),
          );
          break;
        case MultiServiceFilterEndpoint.platform:
          this.servicesConnector.getPlatforms(entry.url, filter).subscribe(
            (res) => this.setItems(res, filter, entry.url, filter.service),
            (error) => this.errorOnLoading(),
          );
          break;
        case MultiServiceFilterEndpoint.dataset:
          this.servicesConnector.getDatasets(entry.url, filter).subscribe(
            (res) => this.setItems(res, filter, entry.url, filter.service),
            (error) => this.errorOnLoading(),
          );
          break;
        default:
          console.error('Wrong endpoint: ' + this.endpoint);
          this.loading--;
      }
    });
  }

  protected errorOnLoading(): void {
    this.loading--;
  }

  protected setItems(
    res: FilteredParameter[],
    prevfilter: HelgolandParameterFilter,
    url: string,
    service?: string,
  ): void {
    this.loading--;
    res.forEach((entry) => {
      entry.selected = this.selected === entry.label;
      const filter: Filter = {
        filter: prevfilter,
        itemId: entry.id,
        url,
        service,
      };
      const item = this.items.find((e) => e.label === entry.label);
      if (item) {
        if (
          !item.filterList?.find(
            (e) => e.itemId === filter.itemId && e.service === filter.service,
          )
        ) {
          item.filterList?.push(filter);
        }
      } else {
        entry.filterList = [filter];
        this.items.push(entry);
      }
    });
  }

  private deselectAllItems() {
    this.items.forEach((e) => (e.selected = false));
  }
}

export interface FilteredParameter extends Parameter {
  filterList?: Filter[];
  internalId?: string;
  selected?: boolean;
}
