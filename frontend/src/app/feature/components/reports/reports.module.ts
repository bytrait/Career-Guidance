import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './component/reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BarChartComponent } from './component/bar-chart/bar-chart.component';
import { NgChartsModule, NgChartsConfiguration } from 'ng2-charts';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { Top3PersonalityStrengthsComponent } from './component/top3-personality-strengths/top3-personality-strengths.component';
import { CareerInterestsComponent } from './component/career-interests/career-interests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CareerOptionsComponent } from './component/career-options/career-options.component';
import { CareerOptionsPathComponent } from './component/career-options-path/career-options-path.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CareerpathModalComponent } from './component/careerpath-modal/careerpath-modal.component';
import { CareerPrefChartComponent } from './component/career-pref-chart/career-pref-chart.component';
@NgModule({
  declarations: [
    ReportsComponent,
    BarChartComponent,
    Top3PersonalityStrengthsComponent,
    CareerInterestsComponent,
    CareerOptionsComponent,
    CareerOptionsPathComponent,
    CareerpathModalComponent,
    CareerPrefChartComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CollapseModule.forRoot(),
    NgChartsModule,
    PopoverModule.forRoot(),
    AccordionModule.forRoot()
  ],
  exports: [Top3PersonalityStrengthsComponent, CareerInterestsComponent, CareerOptionsPathComponent, CareerpathModalComponent, CareerOptionsComponent, CareerPrefChartComponent],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false } }
  ]
})
export class ReportsModule { }
