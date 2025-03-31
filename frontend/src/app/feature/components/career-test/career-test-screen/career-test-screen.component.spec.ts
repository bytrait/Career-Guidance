import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerTestScreenComponent } from './career-test-screen.component';

describe('CareerTestScreenComponent', () => {
  let component: CareerTestScreenComponent;
  let fixture: ComponentFixture<CareerTestScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CareerTestScreenComponent]
    });
    fixture = TestBed.createComponent(CareerTestScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
