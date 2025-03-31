import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkStreamsComponent } from './work-streams.component';

describe('WorkStreamsComponent', () => {
  let component: WorkStreamsComponent;
  let fixture: ComponentFixture<WorkStreamsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkStreamsComponent]
    });
    fixture = TestBed.createComponent(WorkStreamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
