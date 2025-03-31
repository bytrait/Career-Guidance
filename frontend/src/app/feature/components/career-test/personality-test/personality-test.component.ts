import { Component, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable, Subscription, Unsubscribable, of, takeUntil } from 'rxjs';
import { ANSWERS_STORAGE_NAME, PERSONALITY_TEST_RESULT } from 'src/app/core/constants';
import { ModalSuccessComponent } from 'src/app/shared/component/modal-success/modal-success.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PersonalityTestService } from 'src/app/shared/services/personality-test.service';
import { SaveTestAnswersService } from 'src/app/shared/services/save-test-answers.service';
@Component({
  selector: 'app-personality-test',
  templateUrl: './personality-test.component.html',
  styleUrls: ['./personality-test.component.scss'],
  providers: [BsModalService]
})
export class PersonalityTestComponent {
  constructor(
    private _router: Router,
    private _personalityTestService: PersonalityTestService,
    private _fb: FormBuilder,
    private modalService: BsModalService,
    private _saveAnswers: SaveTestAnswersService,
    private _authService: AuthService
  ) {

  }
  personalitytestForm: FormGroup;
  personalityList: any = [];
  currentQuetionValue: number = 0;
  currentCareer: any[] = []
  isTestEnd: boolean = false;
  percentage: number = 0;
  avg: number = 0;
  selectedAnswer: string = ''
  unsubscribe: Subscription;
  bsModalRef?: BsModalRef;
  listOfSelectedItem: any = []
  ngOnInit() {
    this.personalitytestForm = this._fb.group({
      answer: new FormControl('', Validators.required)
    });
 
    this._personalityTestService?.getPersonalityTestList().subscribe(
      {
        next: (result) => {
          if (result?.success) {
            this.personalityList = result?.questionData;
            this.avg = 100 / this.personalityList?.length;
            this.personalityList = this.personalityList.map((quetion: any) => {
              return {
                ...quetion,
                stronglyDisagree: 1,
                slightlyDisagree: 2,
                neitherAgreeNorDisagree: 3,
                slightlyAgree: 4,
                stronglyAgree: 5
              }
            });
            this.percentage = this.avg;
            // console.log(this._authService.getTestAnswers())
            const { personalityAnswers } = this._authService.getTestAnswers();
            if (personalityAnswers ? Object.entries(personalityAnswers)?.length : false) {
              let len = Object.entries(personalityAnswers)?.length;
              this.currentQuetionValue = len;
              this.percentage = len * this.avg;
              console.log(this.percentage)
          
              this.currentCareer = [this.personalityList[len]];
              for (let key in personalityAnswers) {
                this.listOfSelectedItem.push(
                  { [key]: personalityAnswers[key] }
                )
              }
              if (this.percentage === 100) {
                this.finish(true);
              }
              // this.listOfSelectedItem = Object.entries(this._authService.getTestAnswers()?.personalityAnswers).map(())
            } else {
              this.currentCareer = [this.personalityList[this.currentQuetionValue]];
            }
            this.clearStorage();
          }
        },
        error: (e) => {

        }
      }
    );
    this.personalitytestForm.valueChanges.subscribe((item) => {
      // console.log(item)
    });
  }
  isHandleChanged: boolean = false;
  handleChange(value: any) {
    this.selectedAnswer = value;
    this.isHandleChanged = true;
  }


  prev() {
    if (this.currentQuetionValue > -1) {
      this.currentCareer = [];
      this.currentQuetionValue--;
      this.currentCareer = [this.personalityList[this.currentQuetionValue]];
      this.isTestEnd = false;
      this.percentage = this.percentage - this.avg;
      this.personalitytestForm.reset();
      this.showPrevCheckBoxValue();
      this.countNextSave(this.currentQuetionValue + 1)
    }
  }
  next() {
    if (this.currentQuetionValue <= this.personalityList?.length - 1) {
      this.currentCareer = [];
      this.percentage = this.percentage + this.avg;
      this.currentQuetionValue++;
      this.currentCareer = [this.personalityList[this.currentQuetionValue]];
      this.personalitytestForm.reset();
      this.countNextSave(this.currentQuetionValue - 1)
      this.showNextCheckBoxValue();
      this.saveAnswers();
      if (this.currentQuetionValue === this.personalityList?.length) {
        this.isTestEnd = true;
        this.currentQuetionValue = this.personalityList?.length - 1
        this.finish(false);
      }
    } else {
      this.isTestEnd = true
    }
  }

  crrentIndexValue() {
    if (this.listOfSelectedItem?.length > 0) {
      let data = this.listOfSelectedItem.filter((item: any) => parseInt(Object.keys(item)[0]) === this.currentQuetionValue)[0] ? this.listOfSelectedItem.filter((item: any) => parseInt(Object.keys(item)[0]) === this.currentQuetionValue)[0] : []
      return Object.values(data)[0];
    } else {
      return '';
    }
  }


  showPrevCheckBoxValue() {
    this.personalitytestForm.get(ANSWERS_STORAGE_NAME)?.patchValue(this.crrentIndexValue())
  }
  showNextCheckBoxValue() {
    this.personalitytestForm.get(ANSWERS_STORAGE_NAME)?.patchValue(this.crrentIndexValue())
  }

  countPrev() {
    // console.log(this.crrentIndexValue())
    // this.personalitytestForm.get(ANSWERS_STORAGE_NAME)?.patchValue(this.crrentIndexValue())
    // this.isHandleChanged = false;
  }
  countNextSave(currentQuetionValue: number) {
    let isHave = !!this.listOfSelectedItem.filter((item: any) => parseInt(Object.keys(item)[0]) === currentQuetionValue).length;
    if (!isHave) {
      this.listOfSelectedItem.push({
        [currentQuetionValue]: this.selectedAnswer
      });

    } else {
      let index = this.listOfSelectedItem.findIndex((x: any) => parseInt(Object.keys(x)[0]) === currentQuetionValue);
      if (this.isHandleChanged) {
        this.listOfSelectedItem.splice(index, 1);
        this.listOfSelectedItem.push({
          [currentQuetionValue]: this.selectedAnswer
        });
        this.listOfSelectedItem.sort((x: any, b: any) => parseInt(Object.keys(x)[0]) - parseInt(Object.keys(b)[0]))
        this.isHandleChanged = false
      }

    }

  }


  saveAnswers() {
    this._saveAnswers.savePersonalityTest(this.getAnswers()).subscribe((result) => {
      if (result) {



      }
    })
  }

  getAnswers() {
    let answers: any = {};
    console.log(this.listOfSelectedItem)
    this.listOfSelectedItem.forEach((element: any, index: number) => {
      answers = {
        ...answers,
        [index + 1]: Object.values(element)[0]
      }
    });

    let request = {
      answers: { ...answers }
    }
    return request
  }

  finish(isAutoSave: boolean = false) {
    let answers: any = {};
    this.listOfSelectedItem.forEach((element: any, index: number) => {
      answers = {
        ...answers,
        [index + 1]: Object.values(element)[0]
      }
    });

    let request = {
      answers: { ...answers }
    }

    if (!isAutoSave) {
      this.unsubscribe = this._personalityTestService.postPersonalityTest(request).subscribe((result) => {
        if (result) {
          this._personalityTestService.setPersonalityTestResult(result);
          this.clearStorage()
          //localStorage.setItem(PERSONALITY_TEST_RESULT,JSON.stringify(scoreByCategoryType))
          this.openModalWithComponent();
        }
      })
    } else {
      this.unsubscribe = this._personalityTestService.postPersonalityTest(request).subscribe((result) => {
        if (result) {
          this._personalityTestService.setPersonalityTestResult(result);
          this.clearStorage()
          //localStorage.setItem(PERSONALITY_TEST_RESULT,JSON.stringify(scoreByCategoryType))
          this._router.navigate(['dashboard/careertest-welcome']);
        }
      })
    }

  }

  clearStorage() {
    this.personalityList?.forEach((element: any, index: any) => {
      localStorage.removeItem(index);
    });
  }

  openModalWithComponent() {
    const initialState: ModalOptions = {
      initialState: {
        header: 'Well done! You have successfully completed the personality test',
        title: 'Modal with component'
      },
      backdrop: true,
      ignoreBackdropClick: true
    };

    this.bsModalRef = this.modalService.show(ModalSuccessComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Next';
    this.bsModalRef.onHidden?.subscribe((item) => {
      this._router.navigate(['dashboard/careertest-welcome']);
    })
  }

  @HostListener('window:beforeunload', ['$event'])
  canDeactivate(): Observable<boolean> {
    if (this.currentQuetionValue > 0) {
      const result = window.confirm('There are unsaved changes! Are   you sure?');
      return of(result);
    }
    return of(true);
  }

  ngOnDestory() {
    if (this.unsubscribe) this.unsubscribe.unsubscribe();
  }
}
