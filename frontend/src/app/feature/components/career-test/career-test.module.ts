import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CareerTestRoutingModule } from './career-test-routing.module';
import { CareerTestScreenComponent } from './career-test-screen/career-test-screen.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalityTestComponent } from './personality-test/personality-test.component';
import { CareerInterestTestComponent } from './career-interest-test/career-interest-test.component';
import { WorkStreamsComponent } from './work-streams/work-streams.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    CareerTestScreenComponent,
    PersonalityTestComponent,
    CareerInterestTestComponent,
    WorkStreamsComponent
  ],
  imports: [
    CommonModule,
    CareerTestRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PopoverModule.forRoot(),
    TooltipModule.forRoot()
  ]
})
export class CareerTestModule { }
