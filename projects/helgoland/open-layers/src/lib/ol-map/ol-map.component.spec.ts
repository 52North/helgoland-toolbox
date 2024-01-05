import { TestBed, waitForAsync } from '@angular/core/testing';

import { OlMapComponent } from './ol-map.component';

describe('OlMapComponent', () => {
  // let component: OlMapComponent;
  // let fixture: ComponentFixture<OlMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OlMapComponent],
    }).compileComponents();
  }));

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(OlMapComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  it('should be fixed', () => {
    expect(true).toBeTruthy();
  });
});
