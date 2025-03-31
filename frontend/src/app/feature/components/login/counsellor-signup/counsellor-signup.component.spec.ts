import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounsellorSignupComponent } from './counsellor-signup.component';

describe('CounsellorSignupComponent', () => {
  let component: CounsellorSignupComponent;
  let fixture: ComponentFixture<CounsellorSignupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounsellorSignupComponent]
    });
    fixture = TestBed.createComponent(CounsellorSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
