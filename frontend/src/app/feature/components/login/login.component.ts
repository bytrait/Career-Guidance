import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { STORAGE_NAME } from 'src/app/core/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private router:Router){}

  ngOnInit() {
      sessionStorage.removeItem(STORAGE_NAME);
        // this.router.navigate(['login'])
  }

 
}
