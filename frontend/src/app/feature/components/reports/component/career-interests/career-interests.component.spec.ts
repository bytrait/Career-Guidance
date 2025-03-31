import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerInterestsComponent } from './career-interests.component';

describe('CareerInterestsComponent', () => {
  let component: CareerInterestsComponent;
  let fixture: ComponentFixture<CareerInterestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CareerInterestsComponent]
    });
    fixture = TestBed.createComponent(CareerInterestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
