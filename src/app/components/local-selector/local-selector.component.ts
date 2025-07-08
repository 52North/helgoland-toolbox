import { Component } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { LocalSelectorComponent } from '@helgoland/core';

@Component({
  selector: 'n52-lang-selector',
  templateUrl: './local-selector.component.html',
  styleUrls: ['./local-selector.component.scss'],
  imports: [MatRadioModule],
})
export class LocalSelectorImplComponent extends LocalSelectorComponent {}
