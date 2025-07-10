import { Component, viewChild } from '@angular/core';
import {
  MatListModule,
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MultiServiceFilterSelectorComponent } from '@helgoland/selector';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'helgoland-common-parameter-list-selector',
  templateUrl: './parameter-list-selector.component.html',
  styleUrls: ['./parameter-list-selector.component.scss'],
  imports: [MatListModule, MatProgressBarModule, TranslateModule],
})
export class ParameterListSelectorComponent extends MultiServiceFilterSelectorComponent {
  readonly list = viewChild(MatSelectionList);

  public selectionChanged(selection: MatSelectionListChange) {
    const match = this.items.find((e) => e.id === selection.options[0].value);
    if (match) {
      this.onItemSelected.emit(match);
    }
  }
}
