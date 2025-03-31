import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerPreferenceComponent } from './career-preference.component';

describe('CareerPreferenceComponent', () => {
  let component: CareerPreferenceComponent;
  let fixture: ComponentFixture<CareerPreferenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CareerPreferenceComponent]
    });
    fixture = TestBed.createComponent(CareerPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
