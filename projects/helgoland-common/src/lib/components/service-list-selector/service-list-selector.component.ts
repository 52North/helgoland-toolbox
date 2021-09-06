import { Component } from '@angular/core';
import { ServiceSelectorComponent } from '@helgoland/selector';

@Component({
  selector: 'helgoland-common-service-list-selector',
  templateUrl: './service-list-selector.component.html',
  styleUrls: ['./service-list-selector.component.scss']
})
export class ServiceListSelectorComponent extends ServiceSelectorComponent { }
