import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms"

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent {

  @Input() loginForm: FormGroup;
  constructor(private router: Router, private _fb: FormBuilder) {

  }

  ngOnInit() {
    this.loginForm = this._fb.group({
      otp: new FormControl('', [Validators.required])
    })
  }

  submit() {
 
    // this.router.navigate(['/dashboard'])
  }
}
