import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerPrefChartComponent } from './career-pref-chart.component';

describe('CareerPrefChartComponent', () => {
  let component: CareerPrefChartComponent;
  let fixture: ComponentFixture<CareerPrefChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CareerPrefChartComponent]
    });
    fixture = TestBed.createComponent(CareerPrefChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
