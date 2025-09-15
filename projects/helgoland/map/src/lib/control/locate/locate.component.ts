import { Component, inject } from '@angular/core';

import { NgClass } from '@angular/common';
import { MapControlComponent } from '../map-control-component';
import { LocateService } from './locate.service';

@Component({
  selector: 'n52-locate-control',
  templateUrl: './locate.component.html',
  styleUrls: ['./locate.component.scss'],
  imports: [NgClass],
})
export class LocateControlComponent extends MapControlComponent {
  protected locateService = inject(LocateService);

  isToggled = false;

  locateUser() {
    this.isToggled = !this.isToggled;
    if (this.isToggled) {
      this.locateService.startLocate(this.mapId());
    } else {
      this.locateService.stopLocate(this.mapId());
    }
  }
}
