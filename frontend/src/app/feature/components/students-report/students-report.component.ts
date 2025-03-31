import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { STORAGE_NAME } from 'src/app/core/constants';
import { CareerOptionsService } from 'src/app/shared/services/career-options.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { StudentReportService } from 'src/app/shared/services/student-report.service';

export interface Student {
  email: string,
  studentName: string,
  studentId: number,
  mobile: string,
  branch: string,
  isReportAvailable: string
}

@Component({
  selector: 'app-students-report',
  templateUrl: './students-report.component.html',
  styleUrls: ['./students-report.component.scss']
})
export class StudentsReportComponent {

  studentList: Student[];
  studentName: string;
  allStudentsList: Student[];
  careerTestResults: any
  isLoader: boolean = false;
  showReport: boolean = false;
  showStudents: boolean = false;
  showChat: boolean = false;
  selectedStudentId: number;
  selectedStudentName: string;
  chatData: any;
  question: string = '';
  questionNumber: number = 0;
  showChatText: boolean = true;
  preferredCareer: string;


  constructor(private _toastr: ToastrService, private _studReportService: StudentReportService,
    private _reportService: ReportsService, private _careerOptionsService: CareerOptionsService) {
  }

  ngOnInit() {
    this.getAllStudents();
  }

  searchStudent() {
    this.studentList = this.allStudentsList.filter(item => {
      return item.studentName.toLocaleLowerCase().includes(this.studentName.toLocaleLowerCase());
    })
  }

  getAllStudents() {
    this._studReportService.getSchoolStudents().subscribe({
      next: (result) => {
        if (result.success) {
          this.showReport = false;
          this.showStudents = true;
          this.showChat = false;
          //this._toastr.success(result.message);
          this.studentList = result.students;
          this.allStudentsList = result.students;
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

  showStudentList() {
    this.showReport = false;
    this.showStudents = true;
    this.showChat = false;
  }

  openChat() {
    this.showReport = false;
    this.showStudents = false;
    this.showChat = true;
    this.showChatText = true;
    this.question = '';
    this.isLoader = true;
    // call API to get chat data
    this._studReportService.getStudentChat(this.selectedStudentId).subscribe({
      next: (result) => {
        if (result.success) {
          this.chatData = result.chat;
          if (this.chatData.question1 == null) {
            this.questionNumber = 1;
          }
          else if (this.chatData.question2 == null) {
            this.questionNumber = 2;
          }
          else if (this.chatData.question3 == null) {
            this.questionNumber = 3;
          } else if (this.chatData.question3 != null) {
            this.showChatText = false;
          }
          this.isLoader = false;
        } else {
          this.isLoader = false;
        }
      }, error: (error) => {
        this.isLoader = false;
      }
    }
    )

  }

  sendQuestion() {
    this.isLoader = true;
    // call API to get chat data
    this._studReportService.getAnswer(this.selectedStudentId, this.question, this.questionNumber).subscribe({
      next: (result) => {
        this.question = '';
        if (result.success) {
          this.chatData = result.chat;
          if (this.chatData.question1 == null) {
            this.questionNumber = 1;
          }
          else if (this.chatData.question2 == null) {
            this.questionNumber = 2;
          }
          else if (this.chatData.question3 == null) {
            this.questionNumber = 3;
          } else if (this.chatData.question3 != null) {
            this.showChatText = false;
          }
          this.isLoader = false;
        } else {
          this.isLoader = false;
        }
      }, error: (error) => {
        this.question = '';
        this.isLoader = false;
      }
    }
    )

  }

  openReport() {
    this.showReport = true;
    this.showStudents = false;
    this.showChat = false;
  }

  viewReport(studentId: number, studentName: string) {
    this.isLoader = true;
    this.selectedStudentId = studentId;
    this.selectedStudentName = studentName;
    sessionStorage.setItem('STUDENT_NAME', studentName);
    this._studReportService.getStudentReport(studentId).subscribe({
      next: (result) => {
        if (result.success) {
          this._reportService.setReports(result);
          const { careerInterestData, careerOptions, preferredCareer } = result.reportData;
          let personalityData = {
            ...result?.reportData?.personalityData
          }
          this.careerTestResults = careerInterestData;
          this.preferredCareer = preferredCareer;
          this.showReport = true;
          this.showStudents = false;
          this.showChat = false;
          this.isLoader = false;
          // Set report genereatd to true in session 
          const storedDataString = sessionStorage.getItem(STORAGE_NAME);
          let isReport: boolean = false;
          let userData;
          if (storedDataString) {
            userData = JSON.parse(storedDataString);
            userData.reportGenerated = true
          }
          // set career title to empty
          this._careerOptionsService.setCareerTitle('', null);
          sessionStorage.setItem(STORAGE_NAME, JSON.stringify(userData));
        } else {
          this.isLoader = false;
        }
      }, error: (error) => {
        this.isLoader = false;
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
