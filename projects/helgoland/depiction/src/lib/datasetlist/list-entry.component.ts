import {
  Directive,
  OnDestroy,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';
import { InternalDatasetId, InternalIdHandler } from '@helgoland/core';
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
  protected internalIdHandler = inject(InternalIdHandler);
  protected translateSrvc = inject(TranslateService);

  public readonly datasetId = input.required<string>();

  public readonly selected = input<boolean>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onDeleteDataset = output<boolean>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onSelectDataset = output<boolean>();

  public loading: boolean | undefined;

  protected internalId: InternalDatasetId | undefined;

  private langChangeSubscription: Subscription | undefined;

  public ngOnInit(): void {
    this.internalId = this.internalIdHandler.resolveInternalId(
      this.datasetId(),
    );
    this.loadDataset(this.internalId, this.translateSrvc.currentLang);
    this.langChangeSubscription = this.translateSrvc.onLangChange.subscribe(
      (langChangeEvent: LangChangeEvent) =>
        this.onLanguageChanged(langChangeEvent),
    );
  }

  public ngOnDestroy(): void {
    this.langChangeSubscription?.unsubscribe();
  }

  public removeDataset() {
    this.onDeleteDataset.emit(true);
  }

  public toggleSelection() {
    this.onSelectDataset.emit(!this.selected());
  }

  protected onLanguageChanged(langChangeEvent: LangChangeEvent): void {
    if (this.internalId) {
      this.loadDataset(this.internalId, langChangeEvent.lang);
    }
  }

  protected abstract loadDataset(
    internalId: InternalDatasetId,
    locale?: string,
  ): void;
}
