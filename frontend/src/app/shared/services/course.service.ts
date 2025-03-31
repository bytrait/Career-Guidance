import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient, private router: Router) { }

  getCourses(registrationToken: string): Observable<any> {
    return this.http.get(environment.apiUrl + `/api/v1/get-courses?registrationToken=${registrationToken}`)
  }
}

