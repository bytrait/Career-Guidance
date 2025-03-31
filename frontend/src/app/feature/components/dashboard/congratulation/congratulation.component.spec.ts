import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongratulationComponent } from './congratulation.component';

describe('CongratulationComponent', () => {
  let component: CongratulationComponent;
  let fixture: ComponentFixture<CongratulationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CongratulationComponent]
    });
    fixture = TestBed.createComponent(CongratulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
