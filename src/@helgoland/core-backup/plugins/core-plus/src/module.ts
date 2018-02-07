import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '@helgoland/core';
import { CorePlusComponent } from './core-plus.component';

@NgModule({
  declarations: [ CorePlusComponent ],
  imports: [ CommonModule, CoreModule ],
  exports: [ CorePlusComponent ],
})
export class CorePlusModule {

}
