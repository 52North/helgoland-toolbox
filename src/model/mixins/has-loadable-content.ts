import { EventEmitter, Output } from '@angular/core';

export class HasLoadableContent {

    public onContentLoading: EventEmitter<boolean>;

    public isContentLoading(loading: boolean) {
        this.onContentLoading.emit(loading);
    }

}
