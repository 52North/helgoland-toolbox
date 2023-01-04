import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { InternalDatasetId, InternalIdHandler, Required } from '@helgoland/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

/**
 * Represents an abstract dataset entry for a list, which has the following functions:
 *  - can be selected and is selectable internally, with a corresponding output event
 *  - can be deleted, which also triggers an output event
 *  - translatable, so it triggers the methode onLanguageChanged when the language is switched
 */
@Directive()
export abstract class ListEntryComponent implements OnInit, OnDestroy {

    @Input() @Required
    public datasetId!: string;

    @Input()
    public selected: boolean | undefined;

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onDeleteDataset: EventEmitter<boolean> = new EventEmitter();

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onSelectDataset: EventEmitter<boolean> = new EventEmitter();

    public loading: boolean | undefined;

    protected internalId: InternalDatasetId | undefined;

    private langChangeSubscription: Subscription | undefined;

    constructor(
        protected internalIdHandler: InternalIdHandler,
        protected translateSrvc: TranslateService
    ) { }

    public ngOnInit(): void {
        this.internalId = this.internalIdHandler.resolveInternalId(this.datasetId);
        this.loadDataset(this.internalId, this.translateSrvc.currentLang);
        this.langChangeSubscription = this.translateSrvc.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => this.onLanguageChanged(langChangeEvent));
    }

    public ngOnDestroy(): void {
        this.langChangeSubscription?.unsubscribe();
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
            this.loadDataset(this.internalId, langChangeEvent.lang);
        }
    }

    protected abstract loadDataset(internalId: InternalDatasetId, locale?: string): void;

}
