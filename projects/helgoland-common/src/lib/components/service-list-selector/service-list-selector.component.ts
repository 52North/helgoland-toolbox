import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  HelgolandSelectorModule,
  ServiceSelectorComponent,
} from '@helgoland/selector';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'helgoland-common-service-list-selector',
  templateUrl: './service-list-selector.component.html',
  styleUrls: ['./service-list-selector.component.scss'],
  imports: [
    CommonModule,
    HelgolandSelectorModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    TranslateModule,
  ],
  standalone: true,
})
export class ServiceListSelectorComponent extends ServiceSelectorComponent {}
