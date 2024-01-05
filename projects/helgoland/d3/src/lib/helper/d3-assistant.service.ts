import { Injectable } from '@angular/core';

import { DataConst, YAxis } from '../model/d3-general';

export abstract class D3AssistantService {
  getLabel?(axis: YAxis, datasets: DataConst[]): string;
}

@Injectable()
export class EmptyAssistantService implements D3AssistantService {}
