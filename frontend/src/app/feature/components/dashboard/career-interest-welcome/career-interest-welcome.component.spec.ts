import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerInterestWelcomeComponent } from './career-interest-welcome.component';

describe('CareerInterestWelcomeComponent', () => {
  let component: CareerInterestWelcomeComponent;
  let fixture: ComponentFixture<CareerInterestWelcomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CareerInterestWelcomeComponent]
    });
    fixture = TestBed.createComponent(CareerInterestWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
