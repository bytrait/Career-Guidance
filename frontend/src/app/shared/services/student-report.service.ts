import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentReportService {

  constructor(private http: HttpClient) { }

  getSchoolStudents(): Observable<any> {
    return this.http.get(environment.apiUrl + `/api/v1/students`)
  }

  getStudentReport(studentId: number): Observable<any> {
    // set this studentid in session. use this student id to get the career steps
    sessionStorage.setItem('STUDENT_ID', ''+studentId);
    return this.http.get(environment.apiUrl + `/api/v1/student/career-report?studentId=${studentId}`)
  }

  getStudentChat(studentId: number): Observable<any> {
    return this.http.get(environment.apiUrl + `/api/v1/studentChat?studentId=${studentId}`)
  }

  getUserChat(): Observable<any> {
    return this.http.get(environment.apiUrl + `/api/v1/userChat`)
  }
  
  getChatAnswer(question: string): Observable<any> {
    const encodedQuestion = encodeURIComponent(question); 
    return this.http.get(environment.apiUrl + `/api/v1/userChatAnswer?question=${encodedQuestion}`)
  }

  getAnswer(studentId: number, question: string, questionNumber: number): Observable<any> {
    return this.http.get(environment.apiUrl + `/api/v1/chatAnswer?studentId=${studentId}&question=${question}&questionNumber=${questionNumber}`)
  }

  getCareerPreferences(branch:string): Observable<any> {
    return this.http.get(environment.apiUrl + `/api/v1/get-career-preferences?branch=${branch}`)
  }

  getReportCourses(): Observable<any> {
    return this.http.get(environment.apiUrl + '/api/v1/get-report-courses')
  }

}
