import { Component } from '@angular/core';
import { LocalSelectorComponent } from '@helgoland/core';

@Component({
  selector: 'helgoland-common-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent extends LocalSelectorComponent { }
