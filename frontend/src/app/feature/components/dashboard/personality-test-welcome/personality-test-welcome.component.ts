import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-personality-test-welcome',
  templateUrl: './personality-test-welcome.component.html',
  styleUrls: ['./personality-test-welcome.component.scss']
})
export class PersonalityTestWelcomeComponent {
  constructor(private router: Router, private activeRouter: ActivatedRoute, private _authService: AuthService) {

  }
  userName: string = ''

  ngOnInit() {
    this.userName = this._authService.getuserName();
    this.activeRouter.params.subscribe((item) => {
     
    })
  }

  onStartTest() {
    this.router.navigate(['dashboard/career/personalitytest'])
  }
}
