import { Component, OnInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { PagerService } from "../../common/services/pager.service";
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

  // Sort
  searchForm: FormGroup;
  searchString: string;

  // Pagination
  pager: any = {};
  pagedResults: any[];

  constructor(
    private lmsService: LmsService,
    private pagerService: PagerService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadAllOverdueLoans();
    this.initializeFormGroup();
  }

  initializeFormGroup() {
    this.searchForm = new FormGroup({
      searchString: new FormControl(this.searchString),
    });
  }

  search() {
    let searchString = this.searchForm.value.searchString;
    let dash = "/";
    if (searchString.length != "") {
      this.lmsService
        .getAll(
          `${environment.appUrl}${environment.readOverdueLoansURI}${environment.likeURI}${dash}${searchString}`
        )
        .subscribe(
          (res) => {
            this.loans = res;
            this.totalLoans = this.loans.length;
            this.searchString = "";
            this.setPage(1);
          },
          (error) => {
            this.searchString = "";
          }
        );
    } else {
      this.searchString = "";
      this.loadAllOverdueLoans();
    }
  }

  loadAllOverdueLoans() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readOverdueLoansURI}`)
      .subscribe((res) => {
        this.loans = res;
        this.totalLoans = this.loans.length;
        this.setPage(1);
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

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalLoans) {
      return;
    }
    this.pager = this.pagerService.getPager(this.totalLoans, page, 10);
    this.pagedResults = this.loans.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }
}
