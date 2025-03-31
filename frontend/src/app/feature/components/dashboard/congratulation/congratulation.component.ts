import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-congratulation',
  templateUrl: './congratulation.component.html',
  styleUrls: ['./congratulation.component.scss']
})
export class CongratulationComponent {

  constructor(private router: Router,private _authService: AuthService,private activeRouter: ActivatedRoute) {

  }
  userName: string = ''
  ngOnInit() {
    this.userName = this._authService.getuserName();
    this.activeRouter.params.subscribe((item) => {
    })
  }
  onReports() {
      this.router.navigate(['dashboard/reports'])
  }
}
