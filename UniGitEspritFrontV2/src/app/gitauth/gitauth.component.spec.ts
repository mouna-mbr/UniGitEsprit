import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitauthComponent } from './gitauth.component';

describe('GitauthComponent', () => {
  let component: GitauthComponent;
  let fixture: ComponentFixture<GitauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GitauthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GitauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
