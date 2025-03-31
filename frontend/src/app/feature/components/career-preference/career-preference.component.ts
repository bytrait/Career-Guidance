import { Component, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StudentReportService } from 'src/app/shared/services/student-report.service';

@Component({
  selector: 'app-career-preference',
  templateUrl: './career-preference.component.html',
  styleUrls: ['./career-preference.component.scss']
})
export class CareerPreferenceComponent {

  isLoader: boolean = false;
  careerData: any;
  courses: string[] = [];


  constructor(private _toastr: ToastrService, private _studReportService: StudentReportService, private cd: ChangeDetectorRef) {
  }


  ngOnInit() {
    this.getCareerPreferences('');
    this.getCareerPrefCourses();
  }

  getCareerPreferences(course: string) {
    this.isLoader = true;
    this._studReportService.getCareerPreferences(course).subscribe({
      next: (result) => {
        if (result.success) {
          this.careerData = result.preferenceData;
          this.cd.detectChanges();
        } else {
          this.getError(result.message)
        }
        this.isLoader = false;
      },
      error: (error) => {
        this.getError(error.message)
        this.isLoader = false;
      }
    }
    )
  }

  updateCourse(event: any) {
    this.getCareerPreferences(event.target.value)
  }

  getCareerPrefCourses() {
    this._studReportService.getReportCourses().subscribe({
      next: (result) => {
        if (result.success) {
          this.courses = result.courseData;
          this.cd.detectChanges();
        } else {
          this.getError(result.message)
        }
      },
      error: (error) => {
        this.getError(error.message)
      }
    }
    )
  }

  getError(errorMsg: string) {
    this._toastr.error(errorMsg, '', {
      closeButton: true,
      disableTimeOut: true,
      tapToDismiss: false
    })
      .onHidden
      .subscribe(() => {

      }
      );
  }

}
