import { Component } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-success',
  templateUrl: './modal-success.component.html',
  styleUrls: ['./modal-success.component.scss']
})
export class ModalSuccessComponent {
  title?: string;
  closeBtnName?: string;
  header: string[] = [];
 
  constructor(public bsModalRef: BsModalRef) {}
 
  ngOnInit() {
    
  }
}
