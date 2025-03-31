import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Top3PersonalityStrengthsComponent } from './top3-personality-strengths.component';

describe('Top3PersonalityStrengthsComponent', () => {
  let component: Top3PersonalityStrengthsComponent;
  let fixture: ComponentFixture<Top3PersonalityStrengthsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Top3PersonalityStrengthsComponent]
    });
    fixture = TestBed.createComponent(Top3PersonalityStrengthsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
