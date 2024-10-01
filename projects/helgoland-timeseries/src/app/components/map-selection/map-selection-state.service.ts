import { Injectable } from '@angular/core';
import { HelgolandService } from '@helgoland/core';

@Injectable({
  providedIn: 'root',
})
export class MapSelectionStateService {
  selectedService?: HelgolandService;

  selectedPhenomenonId?: string;
}
