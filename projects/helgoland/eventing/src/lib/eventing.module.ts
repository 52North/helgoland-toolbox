import { NgModule } from '@angular/core';

import { EventingApiService } from './eventing-api.service';
import { EventingImplApiInterface } from './eventing-impl-api-interface.service';

/**
 * Provides standard eventing api service implemention
 */
@NgModule({
  providers: [
    {
      provide: EventingApiService,
      useClass: EventingImplApiInterface,
    },
  ],
})
export class HelgolandEventingModule {}
