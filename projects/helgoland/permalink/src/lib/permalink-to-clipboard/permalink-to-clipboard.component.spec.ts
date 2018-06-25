import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClipboardModule } from 'ngx-clipboard';

import { PermalinkToClipboardComponent } from './permalink-to-clipboard.component';

describe('PermalinkToClipboardComponent', () => {
  let component: PermalinkToClipboardComponent;
  let fixture: ComponentFixture<PermalinkToClipboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ClipboardModule
      ],
      declarations: [
        PermalinkToClipboardComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermalinkToClipboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
