import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesSujetComponent } from './demandes-sujet.component';

describe('DemandesSujetComponent', () => {
  let component: DemandesSujetComponent;
  let fixture: ComponentFixture<DemandesSujetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesSujetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandesSujetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
