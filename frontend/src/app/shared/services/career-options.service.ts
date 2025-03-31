import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CareerOptionsService {

  private careerOptionsStream = new BehaviorSubject({})
  private careerOptionsStream$ = this.careerOptionsStream.asObservable();


  constructor() { }


  setCareerTitle(careerTitle: string, description: any) {
    let currentCareer = {
      careerTitle,
      description
    }
    this.careerOptionsStream.next(currentCareer)
  }

  getCareerTitle(): Observable<any> {
    return this.careerOptionsStream$
  }
}
