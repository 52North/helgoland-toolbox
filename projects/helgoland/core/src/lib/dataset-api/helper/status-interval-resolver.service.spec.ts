import { TestBed, inject } from '@angular/core/testing';

import { StatusIntervalResolverService } from './status-interval-resolver.service';
import { StatusInterval } from '../../model/dataset-api/dataset';

describe('StatusIntervalResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatusIntervalResolverService]
    });
  });

  it('should be created', inject([StatusIntervalResolverService], (service: StatusIntervalResolverService) => {
    expect(service).toBeTruthy();
  }));

  it('should get the matching status interval', inject([StatusIntervalResolverService], (service: StatusIntervalResolverService) => {
    const intervals: StatusInterval[] = [
      {
        lower: '20.0',
        upper: '10000.0',
        name: '20 - MAX BC',
        color: '#5A0000'
      },
      {
        lower: '15.0',
        upper: '20.0',
        name: '15 - 19.99 BC',
        color: '#C00000'
      },
      {
        lower: '10.0',
        upper: '15.0',
        name: '10 - 14.99 BC',
        color: '#FF0000'
      },
      {
        lower: '7.0',
        upper: '10.0',
        name: '7 - 9.99 BC',
        color: '#FF8000'
      },
      {
        lower: '5.0',
        upper: '7.0',
        name: '5 - 6.99 BC',
        color: '#F8E748'
      },
      {
        lower: '4.0',
        upper: '5.0',
        name: '4 - 4.99 BC',
        color: '#CCFF33'
      },
      {
        lower: '3.0',
        upper: '4.0',
        name: '3 - 3.99 BC',
        color: '#00FF00'
      },
      {
        lower: '2.0',
        upper: '3.0',
        name: '2 - 2.99 BC',
        color: '#009800'
      },
      {
        lower: '1.0',
        upper: '2.0',
        name: '1 - 1.99 BC',
        color: '#007EFD'
      },
      {
        lower: '0.0',
        upper: '1.0',
        name: '0 - 0.99 BC',
        color: '#0000FF'
      }
    ];
    expect(service.getMatchingInterval(4.9, intervals)!.color).toEqual('#CCFF33');
    expect(service.getMatchingInterval(5.0, intervals)!.color).toEqual('#F8E748');
    expect(service.getMatchingInterval(5.1, intervals)!.color).toEqual('#F8E748');
  }));

});
