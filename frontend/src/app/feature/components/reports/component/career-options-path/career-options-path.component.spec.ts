import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerOptionsPathComponent } from './career-options-path.component';

describe('CareerOptionsPathComponent', () => {
  let component: CareerOptionsPathComponent;
  let fixture: ComponentFixture<CareerOptionsPathComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CareerOptionsPathComponent]
    });
    fixture = TestBed.createComponent(CareerOptionsPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
