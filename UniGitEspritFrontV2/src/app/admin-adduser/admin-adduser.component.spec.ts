import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAdduserComponent } from './admin-adduser.component';

describe('AdminAdduserComponent', () => {
  let component: AdminAdduserComponent;
  let fixture: ComponentFixture<AdminAdduserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAdduserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAdduserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
