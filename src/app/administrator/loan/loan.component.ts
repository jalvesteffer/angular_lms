import { Component, OnInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms"

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {

  totalLoans: number;

  loanId: number;
  bookId: number;
  branchId: number;
  cardNo: number;
  dateDue: string;

  loans: any;

  today = new Date();
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;



  constructor(
    private lmsService: LmsService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadAllOverdueLoans();
  }

  loadAllOverdueLoans() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readOverdueLoansURI}`)
      .subscribe((res) => {
        this.loans = res;
        this.totalLoans = this.loans.length;
      },
        (error) => {
          console.log("Error with loadAllOverdueLoans");
        }
      );
  }

  extendLoan(id) {
    const loan = {
      loanId: id
    }

    // perform insert if no publisher id set
    this.lmsService.updateObj(`${environment.appUrl}${environment.extendOverdueLoansURI}`, loan)
      .subscribe((res) => {
        this.loadAllOverdueLoans();
        this.modalService.dismissAll();
      },
        (error) => {
          console.log("error with updateObj");
        }
      );
  }

}
