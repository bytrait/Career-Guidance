import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './component/reports.component';
import { DatePipe } from '@angular/common';

const routes: Routes = [
  { path: '', component: ReportsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class ReportsRoutingModule { }
