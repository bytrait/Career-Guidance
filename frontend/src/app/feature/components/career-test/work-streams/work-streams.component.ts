import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { STORAGE_NAME } from 'src/app/core/constants';
import { CareerTestService } from 'src/app/shared/services/career-test.service';
import { WorkStreamService } from 'src/app/shared/services/work-stream.service';

@Component({
  selector: 'app-work-streams',
  templateUrl: './work-streams.component.html',
  styleUrls: ['./work-streams.component.scss']
})
export class WorkStreamsComponent {

  branch: string = '';
  isLoader: boolean = false;

  constructor(private _router: Router, private _workStreamService: WorkStreamService) {
  }

  ngOnInit() {
    const storedDataString = sessionStorage.getItem(STORAGE_NAME);
    if (storedDataString) {
      const userData = JSON.parse(storedDataString);
      this.branch = userData.branch;
    }
  }

  onNext() {
    this.isLoader = true;
    let requestPayload = {
      careerData: { 'qualification': this.branch }
    }
    this._workStreamService.setWorksStreamData(requestPayload)
    this._router.navigate(['dashboard/congrats'])

  }

}
