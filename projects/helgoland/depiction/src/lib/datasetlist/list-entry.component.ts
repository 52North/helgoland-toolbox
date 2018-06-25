import { EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { InternalIdHandler } from '@helgoland/core';

export abstract class ListEntryComponent implements OnInit {

    @Input()
    public datasetId: string;

    @Input()
    public selected: boolean;

    @Input()
    public highlight: boolean;

    @Output()
    public onDeleteDataset: EventEmitter<boolean> = new EventEmitter();

    @Output()
    public onSelectDataset: EventEmitter<boolean> = new EventEmitter();

    constructor(
        protected internalIdHandler: InternalIdHandler
    ) { }

    public ngOnInit(): void {
        if (this.datasetId) {
            const temp = this.internalIdHandler.resolveInternalId(this.datasetId);
            this.loadDataset(temp.id, temp.url);
        }
    }

    public removeDataset() {
        this.onDeleteDataset.emit(true);
    }

    public toggleSelection() {
        this.selected = !this.selected;
        this.onSelectDataset.emit(this.selected);
    }

    public toggleUomSelection(id, selected) {
        if (this.datasetId === id) {
            this.selected = selected;
            this.onSelectDataset.emit(this.selected);
        }
    }

    protected abstract loadDataset(id: string, url: string): void;
}
