import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { LocalSelectorComponent } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'n52-lang-selector',
  templateUrl: './local-selector.component.html',
  styleUrls: ['./local-selector.component.scss'],
  imports: [MatRadioModule, CommonModule],
  standalone: true,
})
export class LocalSelectorImplComponent extends LocalSelectorComponent {
  constructor(translate: TranslateService) {
    super(translate);
  }
}
