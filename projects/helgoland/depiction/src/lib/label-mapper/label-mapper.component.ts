import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { LabelMapperService } from './label-mapper.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'n52-label-mapper',
    templateUrl: './label-mapper.component.html',
    styleUrls: ['./label-mapper.component.scss'],
    standalone: true,
    imports: [NgIf]
})
export class LabelMapperComponent implements OnChanges {

    @Input()
    public label: string | undefined;

    public determinedLabel: string | undefined;

    public loading = true;

    constructor(
        protected labelMapperSrvc: LabelMapperService
    ) { }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['label'] && this.label) {
            this.labelMapperSrvc.getMappedLabel(this.label)
                .subscribe((label) => {
                    this.determinedLabel = label;
                    this.loading = false;
                });
        } else {
            this.loading = false;
        }
    }
}
