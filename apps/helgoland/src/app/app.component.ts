import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'helgoland-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'helgoland';

  constructor(
    private translate: TranslateService
  ) {
    translate.use('de');
  }
}
