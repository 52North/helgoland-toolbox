import { EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { InternalDatasetId, InternalIdHandler } from '@helgoland/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

/**
 * Represents an dataset entry for a list, which has the following functions:
 *  - can be selected and is selectable internally, with a corresponding output event
 *  - can be deleted, which also triggers an output event
 *  - translatable, so it triggers the methode onLanguageChanged when the language is switched
 */
export abstract class ListEntryComponent implements OnInit, OnDestroy {

    @Input()
    public datasetId: string;

    @Input()
    public selected: boolean;

    @Output()
    public onDeleteDataset: EventEmitter<boolean> = new EventEmitter();

    @Output()
    public onSelectDataset: EventEmitter<boolean> = new EventEmitter();

    public loading;

    protected internalId: InternalDatasetId;

    private langChangeSubscription: Subscription;

    constructor(
        protected internalIdHandler: InternalIdHandler,
        protected translateSrvc: TranslateService
    ) { }

    public ngOnInit(): void {
        if (this.datasetId) {
            this.internalId = this.internalIdHandler.resolveInternalId(this.datasetId);
            this.loadDataset(this.translateSrvc.currentLang);
        }
        this.langChangeSubscription = this.translateSrvc.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => this.onLanguageChanged(langChangeEvent));
    }

    public ngOnDestroy(): void {
        this.langChangeSubscription.unsubscribe();
    }

    public removeDataset() {
        this.onDeleteDataset.emit(true);
    }

    public toggleSelection() {
        this.selected = !this.selected;
        this.onSelectDataset.emit(this.selected);
    }

    protected onLanguageChanged(langChangeEvent: LangChangeEvent): void {
        if (this.internalId) {
            this.loadDataset(langChangeEvent.lang);
        }
    }

    protected abstract loadDataset(lang?: string): void;

}
