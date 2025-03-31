import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-career-interest-welcome',
  templateUrl: './career-interest-welcome.component.html',
  styleUrls: ['./career-interest-welcome.component.scss']
})
export class CareerInterestWelcomeComponent {
  constructor(private router: Router, private activeRouter: ActivatedRoute,private _authService: AuthService) {

  }
  userName: string = ''

  ngOnInit(){
    this.userName = this._authService.getuserName();
  }
  onStartTest() {
    this.router.navigate(['dashboard/career/careerintresttest'])
  }
}
