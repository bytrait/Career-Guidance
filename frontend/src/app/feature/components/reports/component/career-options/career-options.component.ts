import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { WorkStreamService } from 'src/app/shared/services/work-stream.service';
import { MatDialog } from '@angular/material/dialog';
import { Unsubscribable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { CareerOptionsService } from 'src/app/shared/services/career-options.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { STORAGE_NAME } from 'src/app/core/constants';

@Component({
  selector: 'app-career-options',
  templateUrl: './career-options.component.html',
  styleUrls: ['./career-options.component.scss'],
  providers: [BsModalService]
})
export class CareerOptionsComponent {

  constructor(private _careerOptionsService: CareerOptionsService,
    private _reportService: ReportsService,
    private _workStreamService: WorkStreamService,
    private modalService: BsModalService,
    private _authService: AuthService,
    public dialog: MatDialog
  ) {

  }
  @Output() careerTitleName = new EventEmitter<string>();
  careerOptionsList: any = [];
  newCareerList: any = []
  bsModalRef?: BsModalRef;
  careersSelected: any = {}
  unSubscribeWorkGetCareerOptions: Unsubscribable;
  unSubscribePostFindCareerOptions: Unsubscribable;
  unSubscribeSaveCareer: Unsubscribable;
  isReportGenerated: boolean = false;
  careerTitle: string = ''
  @Input() suggestedCareers: any
  @Input() careerStream: string
  qualification: string
  savedPreferredCareer: string
  isCounsellor: boolean = false
  showCareerSaveConfirmation: boolean = false;

  ngOnInit() {
    this.isCounsellor = this._authService.isCounsellor();
    if (this._authService.isReportGenerated()) {

      this._reportService.gerReports().subscribe((result: any) => {
        if (result.success) {
          const { suggestedCareers, careerStream } = result.reportData?.careerOptions;
          this.careerOptionsList = suggestedCareers;
          this.careerStream = careerStream
          this.savedPreferredCareer = result.reportData?.preferredCareer;
          this.addAdditionalItems();
          this.isReportGenerated = true
        }
      })
    } else {
      this.careersSelected = this._workStreamService.getWorksStreamData();
      if (this.careersSelected) {
        this.unSubscribePostFindCareerOptions = this._workStreamService.postFindCareerOptions(this.careersSelected).subscribe((careerGenResponse: any) => {
          if (careerGenResponse.success) {
            this.unSubscribeWorkGetCareerOptions = this._workStreamService.getCareerOptions().subscribe((response: any) => {
              if (response.success) {
                this.careerOptionsList = response.careerOptions?.suggestedCareers;
                this.addAdditionalItems()
              }
            });
          }
        })
      }
    }

  }

  // add there card items for carrer1, career2 and combined at index 0, 3 and 6
  addAdditionalItems() {

    let career1, career2
    if (this.careerStream) {
      this.qualification = this.careerStream
    } else if (this.careersSelected) {
      this.qualification = this.careersSelected?.careerData['qualification']
    }
    this.newCareerList[0] = this.careerOptionsList[0]
    this.newCareerList[1] = this.careerOptionsList[1]
    this.newCareerList[2] = this.careerOptionsList[2]
    this.newCareerList[3] = this.careerOptionsList[3]
    this.newCareerList[4] = this.careerOptionsList[4]
    this.newCareerList[5] = this.careerOptionsList[5]

  }


  onClickCareerOption(careerTitle: string, careerDescription: string) {
    this._careerOptionsService.setCareerTitle(careerTitle, careerDescription);
  }

  savePreferredCareer(careerTitle: string) {
    const storedDataString = sessionStorage.getItem(STORAGE_NAME);
    let branch
    if (storedDataString) {
      const userData = JSON.parse(storedDataString);
      branch = userData.branch;
    }
    const preferredCareer = { careerTitle: careerTitle, course: branch }
    this.unSubscribeSaveCareer = this._workStreamService.savePreferredCareer(preferredCareer).subscribe((careerSaveResponse: any) => {
      if (careerSaveResponse.success) {
        this.savedPreferredCareer = careerTitle;
      }
    })
  }

  openConfirmationDialog(careerTitle: string) {
    this.showCareerSaveConfirmation = true;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'This will save <b>' + careerTitle + '</b> as preferred career. This cannot be changed later.', title: 'Save Preferred Career' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.savePreferredCareer(careerTitle);
      }
    });
  }


  ngOnDestory() {
    if (this.unSubscribePostFindCareerOptions) this.unSubscribePostFindCareerOptions.unsubscribe()
    if (this.unSubscribeWorkGetCareerOptions) this.unSubscribeWorkGetCareerOptions.unsubscribe()
  }

}
