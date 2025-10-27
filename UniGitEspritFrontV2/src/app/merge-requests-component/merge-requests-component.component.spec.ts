import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeRequestsComponentComponent } from './merge-requests-component.component';

describe('MergeRequestsComponentComponent', () => {
  let component: MergeRequestsComponentComponent;
  let fixture: ComponentFixture<MergeRequestsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MergeRequestsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergeRequestsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
