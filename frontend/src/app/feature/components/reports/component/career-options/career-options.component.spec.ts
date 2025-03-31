import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerOptionsComponent } from './career-options.component';

describe('CareerOptionsComponent', () => {
  let component: CareerOptionsComponent;
  let fixture: ComponentFixture<CareerOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CareerOptionsComponent]
    });
    fixture = TestBed.createComponent(CareerOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
