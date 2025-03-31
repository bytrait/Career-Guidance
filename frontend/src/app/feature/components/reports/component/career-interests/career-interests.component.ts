import { Component, Input } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CareerTestService } from 'src/app/shared/services/career-test.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
@Component({
  selector: 'app-career-interests',
  templateUrl: './career-interests.component.html',
  styleUrls: ['./career-interests.component.scss']
})
export class CareerInterestsComponent {

  @Input() careerTestResults: any

  isCollapsed_1 = false;
  isCollapsed_2 = true;
  isCollapsed_3 = true;
  careerInterestAcc: any = [];

  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public radarChartLabels: string[] = [
    "Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"
  ];

  public radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,

    datasets: [
      { data: [65, 59, 90, 81, 56, 55, 40, 30], label: 'Series' },
    ],
  };
  public radarChartType: ChartType = 'radar';

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    // console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    // console.log(event, active);
  }

  careerIntrestData: any = []
  preferredCareer: string;

  constructor(private _reportService: ReportsService, private _careerTestService: CareerTestService, private _authService: AuthService) {

  }

  ngOnInit() {
    if (this._authService.isReportGenerated()) {
      this._reportService.gerReports().subscribe((result: any) => {
        if (result.success) {
          const { careerInterestData, preferredCareer } = result.reportData;
          this.careerIntrestData = careerInterestData
          this.preferredCareer = preferredCareer;
          this.radarChartData = {
            labels: this.careerIntrestData?.map((career: any) => career?.riasecType),
            datasets: [{
              data: this.careerIntrestData?.map((career: any) => career?.score), label: 'Strength',
            }],
          }
          var res = this.careerIntrestData?.sort((a: any, b: any) => b.score - a.score);
          this.careerInterestAcc?.push(res[0]);
          this.careerInterestAcc?.push(res[1]);
        }
      })
    } else {
      this.careerIntrestData = this._careerTestService.getCareerTestResult();
      this.radarChartData = {
        labels: this.careerIntrestData?.map((career: any) => career?.riasecType),
        datasets: [{
          data: this.careerIntrestData?.map((career: any) => career?.score), label: 'Strength',
        }],
      }
      var res = this.careerIntrestData?.sort((a: any, b: any) => b.score - a.score);
      if (res?.length) {
        this.careerInterestAcc?.push(res[0]);
        this.careerInterestAcc?.push(res[1]);
      }

    }
  }




}
