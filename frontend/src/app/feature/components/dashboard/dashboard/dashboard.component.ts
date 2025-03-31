import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  currentUrl: string = ''
  constructor(private router: Router, private _authService: AuthService) {

  }

  ngOnInit() {
    this.currentUrl = this.router.routerState.snapshot.url;
    if (this._authService.isCounsellor()) {
      this.router.navigate(['dashboard/student-reports'])
    }
    else if (this._authService.isReportGenerated()) {
      this.router.navigate(['dashboard/reports'])
    } else {
     
      this.router.navigate(['dashboard/welcome'])
    }
  }
}
