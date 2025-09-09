import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitGroupComponent } from './git-group.component';

describe('GitGroupComponent', () => {
  let component: GitGroupComponent;
  let fixture: ComponentFixture<GitGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GitGroupComponent]
    });
    fixture = TestBed.createComponent(GitGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
