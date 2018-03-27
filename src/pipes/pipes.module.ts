import { NgModule } from '@angular/core';
import { DateProxyPipe } from './dateproxy.pipe';

@NgModule({
    declarations: [
        DateProxyPipe
    ],
    exports: [
        DateProxyPipe
    ]
})
export class HelgolandPipesModule { }
