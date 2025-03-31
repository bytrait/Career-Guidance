import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {


  private reportsStream = new BehaviorSubject({});
  private reportsStream$ = this.reportsStream.asObservable();

  public setReports(reportData: any) {
    this.reportsStream.next(reportData);
  }


  public gerReports(): Observable<any> {
    return this.reportsStream$;
  }


  constructor() { }
}
