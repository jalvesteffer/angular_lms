import { Component, OnInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-borrower-admin',
  templateUrl: './borrower-admin.component.html',
  styleUrls: ['./borrower-admin.component.css']
})
export class BorrowerAdminComponent implements OnInit {

  totalBorrowers: number;
  borrowers: any;
  today = new Date();
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;
  selectedObj: any;

  constructor(private lmsService: LmsService, private modalService: NgbModal) { }

  ngOnInit() {
    this.loadAllBorrowers();
  }

  loadAllBorrowers() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readBorrowersURI}`)
      .subscribe((res) => {
        this.borrowers = res;
        this.totalBorrowers = this.borrowers.length;
      },
        (error) => {
          ;
        }
      );
  }

  deleteBorrower(cardNo) {

    this.lmsService.deleteObj(`${environment.appUrl}${environment.deleteBorrowersURI}`, cardNo)
      .subscribe((res) => {
        this.loadAllBorrowers();
      },
        (error) => {
          ;
        }
      );
  }

  updateBorrower() {
    this.lmsService.updateObj(`${environment.appUrl}${environment.updateBorrowersURI}`, this.selectedObj)
      .subscribe((res) => {
        this.loadAllBorrowers();
        this.modalService.dismissAll();
      },
        (error) => {
          ;
        }
      );
  }

  open(content, obj) {
    this.selectedObj = obj;
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then(
      (result) => {
        this.errMsg = "";
        this.closeResult = `Closed with ${result}`;
      },
      (reason) => {
        this.errMsg = "";
        this.closeResult = `Dismissed`;
      }
    );
  }
}
