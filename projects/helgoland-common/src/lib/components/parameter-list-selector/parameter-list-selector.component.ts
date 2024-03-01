import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatListModule, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HelgolandServicesConnector } from '@helgoland/core';
import { MultiServiceFilterSelectorComponent } from '@helgoland/selector';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'helgoland-common-parameter-list-selector',
  templateUrl: './parameter-list-selector.component.html',
  styleUrls: ['./parameter-list-selector.component.scss'],
  imports: [
    MatListModule,
    MatProgressBarModule,
    TranslateModule,
    CommonModule
  ],
  standalone: true
})
export class ParameterListSelectorComponent extends MultiServiceFilterSelectorComponent {

  @ViewChild(MatSelectionList) list: MatSelectionList;

  constructor(
    protected override translate: TranslateService,
    protected override servicesConnector: HelgolandServicesConnector,
  ) {
    super(servicesConnector, translate);
  }

  public selectionChanged(selection: MatSelectionListChange) {
    const match = this.items.find(e => e.id === selection.options[0].value);
    this.onItemSelected.emit(match);
  }

}
