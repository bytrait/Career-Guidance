import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private _authService: AuthService) { }
  isCounsellor: boolean = false

  onLogOut() {
    this._authService.logout();
  }

  ngOnInit() {
    this.isCounsellor = this._authService.isCounsellor();
  }
}
