import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { versions } from './../../../../../../versions';
import { HelgolandCoreModule } from '@helgoland/core';

@Component({
  selector: 'helgoland-common-version-info',
  templateUrl: './version-info.component.html',
  styleUrls: ['./version-info.component.scss'],
  imports: [
    TranslateModule,
    HelgolandCoreModule
  ],
  standalone: true
})
export class VersionInfoComponent {

  public versions = versions;

}
