import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaveTestAnswersService {

  constructor(private http: HttpClient) { }



  savePersonalityTest(requestData: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/api/v1/personality/save-answers', requestData)
  }

  saveCareerTest(requestData: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/api/v1/career/save-answers', requestData)
  }

  // getPersonalityTestAnswers(): Observable<any> {
  //   return this.http.get(environment.apiUrl + '/api/v1/personality/save-answers')
  // }
}
