import { async, TestBed } from '@angular/core/testing';
import { FavoriteModule } from './favorite.module';

describe('EventingModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FavoriteModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(FavoriteModule).toBeDefined();
  });
});
