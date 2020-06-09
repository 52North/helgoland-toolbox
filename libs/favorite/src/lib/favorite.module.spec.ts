import { async, TestBed } from '@angular/core/testing';
import { HelgolandFavoriteModule } from './favorite.module';

describe('EventingModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandFavoriteModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandFavoriteModule).toBeDefined();
  });
});
