import { Component } from '@angular/core';
import { CareerTestService } from 'src/app/shared/services/career-test.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ANSWERS_STORAGE_NAME } from 'src/app/core/constants';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalSuccessComponent } from 'src/app/shared/component/modal-success/modal-success.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SaveTestAnswersService } from 'src/app/shared/services/save-test-answers.service';
@Component({
  selector: 'app-career-interest-test',
  templateUrl: './career-interest-test.component.html',
  styleUrls: ['./career-interest-test.component.scss'],
  providers: [BsModalService]
})
export class CareerInterestTestComponent {
  constructor(private _router: Router, private _saveAnswers: SaveTestAnswersService, private _authService: AuthService, private _careerTestService: CareerTestService, private _fb: FormBuilder, private modalService: BsModalService) {

  }
  careertestForm: FormGroup;
  careerList: any = [];
  currentQuetionValue: number = 0;
  currentCarrer: any[] = []
  isTestEnd: boolean = false;
  percentage: number = 0;
  avg: number = 0;
  answerOptions: any = [];
  selectedAnswer: string = '';
  listOfSelectedItem: any = [];
  areaList: any = [
    "Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"
  ]
  bsModalRef?: BsModalRef;
  ngOnInit() {
    this.careertestForm = this._fb.group({
      answer: new FormControl('', Validators.required)
    });
    this._careerTestService?.getCareerTestList().subscribe((data) => {
      this.careerList = data.questionData;
      this.answerOptions = [
        {
          "value": 1,
          "name": "Strongly Dislike"
        },
        {
          "value": 2,
          "name": "Slightly Dislike"
        },
        {
          "value": 3,
          "name": "Neither Like Nor Dislike"
        },
        {
          "value": 4,
          "name": "Slightly Like"
        },
        {
          "value": 5,
          "name": "Strongly Like"
        }
      ];
      this.avg = 100 / this.careerList?.length;
      this.percentage = this.avg;
      const { careerAnswers } = this._authService.getTestAnswers();
      if (careerAnswers ? Object.entries(careerAnswers)?.length : false) {
        let len = Object.entries(careerAnswers)?.length;
        this.currentQuetionValue = len;
        this.percentage = len * this.avg;
        this.currentCarrer = [this.careerList[len]];
        for (let key in careerAnswers) {
          this.listOfSelectedItem.push(
            { [key]: careerAnswers[key] }
          )
        }
        // this.listOfSelectedItem = Object.entries(this._authService.getTestAnswers()?.personalityAnswers).map(())
      } else {
        this.currentCarrer = [this.careerList[this.currentQuetionValue]]
      }

    });


    this.careertestForm.valueChanges.subscribe((item) => {
      // console.log(item)
    })
  }


  isHandleChanged: boolean = false;
  handleChange(value: any) {
    this.selectedAnswer = value;
    this.isHandleChanged = true;
  }


  prev() {
    if (this.currentQuetionValue > -1) {
      this.currentCarrer = [];
      this.currentQuetionValue--;
      this.currentCarrer = [this.careerList[this.currentQuetionValue]];
      this.isTestEnd = false;
      this.percentage = this.percentage - this.avg;
      this.careertestForm.reset();
      this.showPrevCheckBoxValue();
      this.countNextSave(this.currentQuetionValue + 1)
    }
  }
  next() {
    if (this.currentQuetionValue <= this.careerList?.length - 1) {
      this.currentCarrer = [];
      this.percentage = this.percentage + this.avg;
      this.currentQuetionValue++;
      this.currentCarrer = [this.careerList[this.currentQuetionValue]];
      this.careertestForm.reset();
      this.countNextSave(this.currentQuetionValue - 1)
      this.showNextCheckBoxValue();
      this.saveAnswers();
      if (this.currentQuetionValue === this.careerList?.length) {
        this.isTestEnd = true
        this.currentQuetionValue = this.careerList?.length - 1;
        this.finish();
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
    this.careertestForm.get(ANSWERS_STORAGE_NAME)?.patchValue(this.crrentIndexValue())
  }
  showNextCheckBoxValue() {
    this.careertestForm.get(ANSWERS_STORAGE_NAME)?.patchValue(this.crrentIndexValue())
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
    this._saveAnswers.saveCareerTest(this.getAnswers()).subscribe((result) => {
      if (result) {



      }
    })
  }

  getAnswers() {
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
    return request
  }


  finish() {
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

    this._careerTestService.postCareerTest(request).subscribe((result) => {
      // if (result) {
      const { success, careerInterestData } = result;
      if (success) {
        this._careerTestService.setCareerTestResult(careerInterestData);
        this.careerList?.forEach((element: any, index: any) => {
          localStorage.removeItem(index);
        });
        // this._careerTestService.setCareerStreamData(answerData?.career);
        this.openModalWithComponent();
      }
      // }
    })
    // this._router.navigate(['dashboard/congrats'])
  }

  openModalWithComponent() {
    const initialState: ModalOptions = {
      initialState: {
        header: 'Well done! You have successfully completed the career interest test',
        title: 'Modal with component'
      },
      backdrop: true,
      ignoreBackdropClick: true
    };

    this.bsModalRef = this.modalService.show(ModalSuccessComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Next';
    this.bsModalRef.onHidden?.subscribe((item) => {
      this._router.navigate(['dashboard/career/workstream'])
    })
  }
}
