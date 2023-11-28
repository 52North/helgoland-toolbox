import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HelgolandCoreModule } from "@helgoland/core";
import { ColorPickerModule } from "ngx-color-picker";

import { AxesOptionsComponent } from "./axes-options/axes-options.component";
import { ColorSelectorComponent } from "./color-selector/color-selector.component";
import { DragOptionsComponent } from "./drag-options/drag-options.component";
import { MinMaxRangeComponent } from "./min-max-range/min-max-range.component";

/**
 * The modification module includes the following functionality:
 * - controls to modify some aspects as:
 *   - color selector
 *   - axes modifications
 */
@NgModule({
  imports: [
    HelgolandCoreModule,
    FormsModule,
    ColorPickerModule,
    ColorSelectorComponent,
    AxesOptionsComponent,
    DragOptionsComponent,
    MinMaxRangeComponent
  ],
  exports: [
    ColorSelectorComponent,
    AxesOptionsComponent,
    DragOptionsComponent,
    MinMaxRangeComponent
  ],
  providers: []
})
export class HelgolandModificationModule { }
