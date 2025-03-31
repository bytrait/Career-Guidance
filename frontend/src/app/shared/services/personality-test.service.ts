import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PERSONALITY_TEST_RESULT } from 'src/app/core/constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalityTestService {

  constructor(private http: HttpClient) { }

  private personalityResultStream = new BehaviorSubject({});
  private personalityResultStream$ = this.personalityResultStream.asObservable();

  private personalityResults: any = {}
    
  


  getPersonalityTestList(): Observable<any> {
    return this.http.get(environment.apiUrl + '/api/v1/personality/questions50')
  }


  postPersonalityTest(requestData: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/api/v1/personality/answers50', requestData) 
  }


  setPersonalityTestResult(data: any) {
    localStorage.setItem(PERSONALITY_TEST_RESULT, JSON.stringify(data))
    this.personalityResults = data;
  }

  getPersonalityTestResult(): any {
    const result = localStorage.getItem(PERSONALITY_TEST_RESULT);
    if (result) {
      return JSON.parse(result);
    }
  }
}
