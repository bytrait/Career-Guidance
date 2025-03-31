import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PersonalityTestService } from 'src/app/shared/services/personality-test.service';
import { ReportsService } from 'src/app/shared/services/reports.service';

@Component({
  selector: 'app-top3-personality-strengths',
  templateUrl: './top3-personality-strengths.component.html',
  styleUrls: ['./top3-personality-strengths.component.scss']
})
export class Top3PersonalityStrengthsComponent {
  @Input() personalityTestResults: any
  isCollapsed_1 = false;
  isCollapsed_2 = true;
  isCollapsed_3 = true;

  toggleCollapsedTabs(isToggle: boolean, collapseTab: string) {
    switch (collapseTab) {
      case 'isCollapsed_1':
        this.isCollapsed_1 = !isToggle;
        this.isCollapsed_2 = true;
        this.isCollapsed_3 = true;
        break;
      case 'isCollapsed_2':
        this.isCollapsed_1 = true;
        this.isCollapsed_2 = !isToggle;
        this.isCollapsed_3 = true;
        break;
      case 'isCollapsed_3':
        this.isCollapsed_1 = true;
        this.isCollapsed_2 = true;
        this.isCollapsed_3 = !isToggle;
        break;


      default:
        break;
    }
  }

  personalityData: any = {};
  description: any = []


  constructor(private _reportService: ReportsService, private _personalityTestService: PersonalityTestService, private _authService: AuthService) {

  }
  ngOnInit() {
    if (this._authService.isReportGenerated()) {
      this._reportService.gerReports().subscribe((result: any) => {
        if (result.success) {
          const { personalityData } = result.reportData;
          this.personalityData = personalityData;

          this.description = [
            this.personalityData['aPersonality'],
            this.personalityData['cPersonality'],
            this.personalityData['ePersonality'],
            this.personalityData['nPersonality'],
            this.personalityData['oPersonality'],
          ]
        }
      })
    } else {
      this.personalityData = this._personalityTestService.getPersonalityTestResult()?.personalityData;
      this.description = [
        this.personalityData['aPersonality'],
        this.personalityData['cPersonality'],
        this.personalityData['ePersonality'],
        this.personalityData['nPersonality'],
        this.personalityData['oPersonality'],
      ]
    }
  }

  // ngOnChanges() {
  //   this.personalityData = this.personalityTestResults?this.personalityTestResults:  this._personalityTestService.getPersonalityTestResult()?.personalityData;
  //   this.description = [
  //     this.personalityData['aPersonality'],
  //     this.personalityData['cPersonality'],
  //     this.personalityData['ePersonality'],
  //     this.personalityData['nPersonality'],
  //     this.personalityData['oPersonality'],
  //   ]
  //   console.log(this.description)
  // }
}
