import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LocalSelectorComponent } from '../../../../../src';

@Component({
    selector: 'n52-lang-selector',
    templateUrl: './local-selector.component.html',
    styleUrls: ['./local-selector.component.scss']
})
export class LocalSelectorImplComponent extends LocalSelectorComponent {

    constructor(translate: TranslateService) {
        super(translate);
    }

}
