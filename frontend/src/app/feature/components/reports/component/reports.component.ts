import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Route, Router } from '@angular/router';
import { Unsubscribable } from 'rxjs';
import { PERSONALITY_TEST_RESULT } from 'src/app/core/constants';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CareerOptionsService } from 'src/app/shared/services/career-options.service';
import { CareerTestService } from 'src/app/shared/services/career-test.service';
import { PersonalityTestService } from 'src/app/shared/services/personality-test.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { StudentReportService } from 'src/app/shared/services/student-report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

  isReportAvaiable: boolean = false;

  isLoader: boolean = true;
  suggestedCareers: any = []
  careerStream: string = ''
  personalityTestResults: any;
  unsubscribeTestReports: Unsubscribable;
  unsubscribeTitle: Unsubscribable;
  careerTestResults: any
  careerTitle: string = ''
  preferredCareer: string;
  showChat: boolean = false;
  question: string;
  chatData: any;
  showReport: boolean = false;
  chatLimitExceeded: boolean = false;
  constructor(
    private _router: Router,
    private _personalityTestService: PersonalityTestService,
    private _careerTestService: CareerTestService,
    private _authService: AuthService,
    private _reportService: ReportsService,
    private _studReportService: StudentReportService,
    private datePipe: DatePipe,
    private _careerOptionsService: CareerOptionsService) {
  }
  ngOnInit() {
    let data = localStorage.getItem(PERSONALITY_TEST_RESULT);
    if (data) {
      this.isReportAvaiable = JSON.parse(data) ? true : false
    } else {
      this.isReportAvaiable = this._authService.isReportGenerated()
    }
    if (this.isReportAvaiable) {
      this.showReport = true;
    }
    if (this._authService.isReportGenerated()) {
      this.isLoader = true;
      this.unsubscribeTestReports = this._careerTestService.getTestReports().subscribe({
        next: (result) => {
          if (result.success) {
            this._reportService.setReports(result);
            const { careerInterestData, careerOptions, preferredCareer } = result.reportData;
            let personalityData = {
              ...result?.reportData?.personalityData
            }
            this.preferredCareer = preferredCareer;
            //  this._personalityTestService.setPersonalityTestResult({ personalityData });
            // this._careerTestService.setCareerTestResult(careerInterestData);
            // this.suggestedCareers = careerOptions?.suggestedCareers
            //  this.personalityTestResults = personalityData
            this.careerTestResults = careerInterestData
            this.isReportAvaiable = true;
            this.showReport = true;
            this.isLoader = false;
          } else {
            this.isLoader = false;
          }
        }, error: (error) => {
          if (error.status === 403 && error.error.message === 'Payment not done') {
            this._router.navigate(['dashboard/payment']);
          }
          this.isLoader = false;
        }
      })
    } else {
      this.isLoader = false;
    }
  }

  ngAfterViewInit() {
    this.unsubscribeTitle = this._careerOptionsService.getCareerTitle().subscribe((res) => {
      if (Object.keys(res).length > 0) {
        setTimeout(() => {
          let el = document.getElementById('careerModelPath');
          el?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: "nearest"
          })
        }, 0);
      } else {
        setTimeout(() => {
          let el = document.querySelector('.page-wrapper');
          el?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: "nearest"
          })
        }, 0);
      }
    })
  }

  onClickGetTitle(title: string) {
    this.careerTitle = title;
  }

  gotAssessment() {
    this._router.navigate(['dashboard/welcome'])
  }

  openReport() {
    this.showReport = true;
    this.showChat = false;
  }

  openChat() {
    this.showChat = true;
    this.showReport = false;
    this.question = '';
    this.isLoader = true;
    // call API to get chat data
    this._studReportService.getUserChat().subscribe({
      next: (result) => {
        this.isLoader = false;
        if (result.success) {
          this.chatData = result.chatData;
          if (this.chatData) {
            this.chatData.chatHistory.forEach((chat: any) => {
              chat.chatTime = this.datePipe.transform(new Date(chat.chatTime), 'dd/MM/yyyy HH:mm:ss') || 'Invalid date';
            });
            if (result.tokenUsed >= 500) {
              this.chatLimitExceeded = true;
            }
          }
        } else {
          this.isLoader = false;
        }
      }, error: (error) => {
        this.isLoader = false;
      }
    }
    )
  }

  sendQuestion() {
    this.isLoader = true;
    // call API to get chat data
    this._studReportService.getChatAnswer(this.question).subscribe({
      next: (result) => {
        this.question = '';
        this.isLoader = false;
        if (result.success) {
          this.chatData = result.chatData;
          if (this.chatData) {
            this.chatData.chatHistory.forEach((chat: any) => {
              chat.chatTime = this.datePipe.transform(new Date(chat.chatTime), 'dd/MM/yyyy HH:mm:ss') || 'Invalid date';
            });
            if (result.tokenUsed >= 500) {
              this.chatLimitExceeded = true;
            }
          }
        } else {
          this.isLoader = false;
        }
      }, error: (error) => {
        this.question = '';
        this.isLoader = false;
      }
    }
    )
  }

  formatDate(dateStr: string) {
    if (dateStr) {
      const date = new Date(dateStr);
      return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm:ss') || '';
    }
    return '';
  }

  ngOnDestory() {
    if (this.unsubscribeTestReports) this.unsubscribeTestReports;
    if (this.unsubscribeTitle) this.unsubscribeTitle;

  }
}
