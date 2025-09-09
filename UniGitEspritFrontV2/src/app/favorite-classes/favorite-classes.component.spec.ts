import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteClassesComponent } from './favorite-classes.component';

describe('FavoriteClassesComponent', () => {
  let component: FavoriteClassesComponent;
  let fixture: ComponentFixture<FavoriteClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteClassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
