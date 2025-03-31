import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalityTestWelcomeComponent } from './personality-test-welcome.component';

describe('PersonalityTestWelcomeComponent', () => {
  let component: PersonalityTestWelcomeComponent;
  let fixture: ComponentFixture<PersonalityTestWelcomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalityTestWelcomeComponent]
    });
    fixture = TestBed.createComponent(PersonalityTestWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
