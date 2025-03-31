import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WORK_STREAM } from 'src/app/core/constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkStreamService {

  constructor(private http: HttpClient) { }

  private careerOptionsStream = new BehaviorSubject(false);
  private careerOptionsStream$ = this.careerOptionsStream.asObservable();

  private careerStepsTitle = new BehaviorSubject('');
  private careerStepsTitle$ = this.careerStepsTitle.asObservable();

  private workStreamData = new BehaviorSubject('');
  private workStreamData$ = this.workStreamData.asObservable();


  postFindCareerOptions(requestdata: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/api/v1/generate-careers', requestdata)
  }

  savePreferredCareer(preferredCareer: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/api/v1/save-preferred-career', preferredCareer)
  }


  getCareerOptions(): Observable<any> {
    return this.http.get(environment.apiUrl + '/api/v1/careers-options')
  }


  getCareer8Steps(careerTitle: string): Observable<any> {
    const studentId = sessionStorage.getItem('STUDENT_ID');

    return this.http.get(environment.apiUrl + `/api/v1/careers-steps?careerTitle=${careerTitle}&studentId=${studentId}`)
  }


  setWorksStreamData(data: any) {
    localStorage.setItem(WORK_STREAM, JSON.stringify(data))
  }

  getWorksStreamData(): any {
    const result = localStorage.getItem(WORK_STREAM);
    if (result) {
      return JSON.parse(result);
    }
  }


  setCareerOptionsData(isSuccess: boolean) {
    this.careerOptionsStream.next(isSuccess);
  }

  getCareerOptionsData(): Observable<boolean> {
    return this.careerOptionsStream$;
  }


  setCareerStepsTitle(title: string) {
    this.careerStepsTitle.next(title);
  }

  getCareerStepsTitle(): Observable<string> {
    return this.careerStepsTitle$;
  }






}
