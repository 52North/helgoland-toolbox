import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule, SettingsService } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
import { LabelMapperComponent } from '../../label-mapper/label-mapper.component';
import { LabelMapperService } from '../../label-mapper/label-mapper.service';
import { ProfileEntryComponent } from './profile-entry.component';

describe('ProfileEntryComponent', () => {
  let component: ProfileEntryComponent;
  let fixture: ComponentFixture<ProfileEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      declarations: [
        ProfileEntryComponent,
        LabelMapperComponent
      ],
      providers: [
        DatasetApiInterfaceTesting,
        LabelMapperService,
        SettingsService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
