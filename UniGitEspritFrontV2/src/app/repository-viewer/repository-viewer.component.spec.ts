import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryViewerComponent } from './repository-viewer.component';

describe('RepositoryViewerComponent', () => {
  let component: RepositoryViewerComponent;
  let fixture: ComponentFixture<RepositoryViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepositoryViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
