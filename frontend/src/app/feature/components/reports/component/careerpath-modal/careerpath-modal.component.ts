import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Unsubscribable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CareerOptionsService } from 'src/app/shared/services/career-options.service';
import { WorkStreamService } from 'src/app/shared/services/work-stream.service';

@Component({
  selector: 'app-careerpath-modal',
  templateUrl: './careerpath-modal.component.html',
  styleUrls: ['./careerpath-modal.component.scss']
})
export class CareerpathModalComponent {
  @Input() title: string = '';
  description: string = '';
  stepsList: any = {
    'firstCareerSteps': {
      'step 1': '',
      'step 2': '',
      'step 3': '',
      'step 4': '',
      'step 5': '',
      'step 6': '',
      'step 7': '',
      'step 8': ''
    }

  }

  strCount: any = 80;
  currentStep: any = 'Step 0';
  isCareerSteps: boolean = false;
  userName: string = '';
  initialStepsContents: boolean = false;
  unsubscribeCareer8Steps: Unsubscribable;
  unsubscribeCareerTitle: Unsubscribable;
  initalStepsList: any = [];
  intervalAPICall: any;
  isInProgressSteps: boolean = true;
  isStep0Completed: boolean = false;
  isStep1Completed: boolean = false;
  isStep2Completed: boolean = false;
  isStep3Completed: boolean = false;
  isStep4Completed: boolean = false;
  isStep5Completed: boolean = false;
  isStep6Completed: boolean = false;
  isStep7Completed: boolean = false;
  isStep8Completed: boolean = false;
  @ViewChild('stepDiv') stepDiv!: ElementRef;
  constructor(private _careerOptionsService: CareerOptionsService, private _workStreamService: WorkStreamService, public bsModalRef: BsModalRef, private _authService: AuthService) {

  }
  ngOnInit() {
    this.currentStep = 'Step 0'
    this.userName = this._authService.getuserName();
    this.getCareerPathData();
    // this.intervalAPICall = setInterval(() => {
    //   this.careerPathLoad()
    // }, 15000)
  }



  getStep(step: string) {
    this.currentStep = 'Step' + ' ' + step
    this.stepDiv.nativeElement.scrollTop = 0;
  }

  resetValue() {
    this.isStep0Completed = false
    this.isStep1Completed = false
    this.isStep2Completed = false
    this.isStep3Completed = false
    this.isStep4Completed = false
    this.isStep5Completed = false
    this.isStep6Completed = false
    this.isStep7Completed = false
    this.isStep8Completed = false
    this.isInProgressSteps = true;
    clearInterval(this.intervalAPICall);
    this.intervalAPICall = null;
  }

  async getCareerPathData() {
    this.resetValue();
    let res = await this._careerOptionsService.getCareerTitle();
    this.unsubscribeCareerTitle = res.subscribe((data: any) => {
      this.title = data?.careerTitle;
      this.description = data?.description;
      if (this.title !== '' && this.title !== undefined) {
        this.careerPathLoad()
        this.intervalAPICall = setInterval(() => {
          console.log('Inerval log')
          this.careerPathLoad()

        }, 15000)
      }
    })


  }

  careerPathLoad() {
    if (this.title !== '') {
      this.unsubscribeCareer8Steps = this._workStreamService.getCareer8Steps(this.title).subscribe((response) => {
        this.stepsList = response.careerSteps;
        this.isCareerSteps = true;
        if (response.careerSteps.firstCareerSteps['Step 0'] !== 'Generating...') {
          this.isStep0Completed = true
        }
        if (response.careerSteps.firstCareerSteps['Step 1'] !== 'Generating...') {
          this.isStep1Completed = true
        }
        if (response.careerSteps.firstCareerSteps['Step 2'] !== 'Generating...') {
          this.isStep2Completed = true
        }
        if (response.careerSteps.firstCareerSteps['Step 3'] !== 'Generating...') {
          this.isStep3Completed = true
        }
        if (response.careerSteps.firstCareerSteps['Step 4'] !== 'Generating...') {
          this.isStep4Completed = true
        }
        if (response.careerSteps.firstCareerSteps['Step 5'] !== 'Generating...') {
          this.isStep5Completed = true
        }
        if (response.careerSteps.firstCareerSteps['Step 6'] !== 'Generating...') {
          this.isStep6Completed = true
        }
        if (response.careerSteps.firstCareerSteps['Step 7'] !== 'Generating...') {
          this.isStep7Completed = true
        }
        if (response.careerSteps.firstCareerSteps['Step 8'] !== 'Generating...') {
          this.isStep8Completed = true
        }
        if (response.careerSteps['status'] === 'Completed') {
          this.isInProgressSteps = false;
          clearInterval(this.intervalAPICall)
        }
        // for (let step in this.stepsList['firstCareerSteps']) {
        //   this.initalStepsList = this.stepsList['firstCareerSteps'][step];
        //   console.log(this.initalStepsList)
        // }

      });
    }

  }

  formatDisplayText(text: string) {
    if (text.includes(":") && !text.includes("https://") && !text.includes("http://")) {
      text = '<b>' + text.slice(0, text.indexOf(":") + 1) + '</b>' + text.slice(text.indexOf(":") + 1, text.length);
    }
    return text;
  }

  ngOnDestory() {
    if (this.unsubscribeCareer8Steps) this.unsubscribeCareer8Steps;
    if (this.unsubscribeCareerTitle) this.unsubscribeCareerTitle;
  }

}
