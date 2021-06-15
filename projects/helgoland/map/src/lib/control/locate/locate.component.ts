import { Component, Input } from '@angular/core';

import { MapControlComponent } from '../map-control-component';
import { LocateService } from './locate.service';
import { MapCache } from '../../base/map-cache.service';

@Component({
    selector: 'n52-locate-control',
    templateUrl: './locate.component.html',
    styleUrls: ['./locate.component.scss']
})
export class LocateControlComponent extends MapControlComponent {

    @Input()
    public mapId: string;

    public isToggled = false;

    constructor(
        protected locateService: LocateService,
        protected mapCache: MapCache
    ) {
        super(mapCache);
    }

    public locateUser() {
        this.isToggled = !this.isToggled;
        if (this.isToggled) {
            this.locateService.startLocate(this.mapId);
        } else {
            this.locateService.stopLocate(this.mapId);
        }
    }
}
