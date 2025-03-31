import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerInterestTestComponent } from './career-interest-test.component';

describe('CareerInterestTestComponent', () => {
  let component: CareerInterestTestComponent;
  let fixture: ComponentFixture<CareerInterestTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CareerInterestTestComponent]
    });
    fixture = TestBed.createComponent(CareerInterestTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
