import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSujetComponent } from './add-sujet.component';

describe('AddSujetComponent', () => {
  let component: AddSujetComponent;
  let fixture: ComponentFixture<AddSujetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSujetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSujetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
