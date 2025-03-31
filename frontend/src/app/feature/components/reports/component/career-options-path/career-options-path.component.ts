import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { WorkStreamService } from 'src/app/shared/services/work-stream.service';

@Component({
  selector: 'app-career-options-path',
  templateUrl: './career-options-path.component.html',
  styleUrls: ['./career-options-path.component.scss']
})
export class CareerOptionsPathComponent {
  // @Output() careerTitle = new EventEmitter<string>();
  stepsList: any = {
    'firstCareerSteps': {
      'step 0': '',
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
  currentStep: any = null;
  isCareerSteps: boolean = false;
  userName:string = ''


  constructor(private _workStreamService: WorkStreamService, private _authService: AuthService) {

  }


  ngOnInit() {

    this.userName = this._authService.getuserName();
    this._workStreamService.getCareerStepsTitle().subscribe((response) => {
      if (response !== '') {
        this._workStreamService.getCareer8Steps(response).subscribe((response) => {
          console.log(response.careerSteps['firstCareerSteps']);
          this.stepsList = response.careerSteps;
          this.isCareerSteps = true;
        });
      }
    });


  }

  getStep(step: string) {
    this.currentStep = 'Step' + ' ' + step
  }

  // ngAfterViewInit(){
  //   const buttons = document.querySelectorAll('.box')
  //   buttons.forEach(button => {
  //     button.addEventListener("click", (event:any) => {
  //       console.log(event);
  //       this.currentStep =  'Step' + ' ' + event.target?.innerText?.split('\n')[0] 
  //     });
  //   })
  // }


}
