import { Component, OnInit } from '@angular/core';
import { HelgolandPlatform, HelgolandServicesConnector } from '@helgoland/core';
import { HelgolandMapSelectorModule } from '@helgoland/map';

@Component({
    templateUrl: './sandbox.component.html',
    styleUrls: ['./sandbox.component.scss'],
    imports: [
        HelgolandMapSelectorModule
    ],
    standalone: true
})
export class SandboxComponent implements OnInit {

    platforms: HelgolandPlatform[];

    constructor(
        private servicesConnector: HelgolandServicesConnector
    ) { }

    public ngOnInit(): void {
        this.servicesConnector.getPlatforms('url').subscribe(res => this.platforms = res);
    }

    public selected(platform: HelgolandPlatform) {
        console.log(platform);
    }

}
