import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { HelgolandServicesConnector } from '@helgoland/core';
import { MultiServiceFilterSelectorComponent } from '@helgoland/selector';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'helgoland-common-parameter-list-selector',
  templateUrl: './parameter-list-selector.component.html',
  styleUrls: ['./parameter-list-selector.component.scss']
})
export class ParameterListSelectorComponent extends MultiServiceFilterSelectorComponent implements OnInit {

  @ViewChild(MatSelectionList) list: MatSelectionList;

  constructor(
    protected translate: TranslateService,
    protected servicesConnector: HelgolandServicesConnector,
  ) {
    super(servicesConnector, translate);
  }

  ngOnInit(): void { }

  public selectionChanged(selection: MatSelectionListChange) {
    const match = this.items.find(e => e.id === selection.option.value);
    this.onItemSelected.emit(match);
  }

}
