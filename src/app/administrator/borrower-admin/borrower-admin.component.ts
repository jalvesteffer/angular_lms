import { Component, OnInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { PagerService } from "../../common/services/pager.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms"

@Component({
  selector: 'app-borrower-admin',
  templateUrl: './borrower-admin.component.html',
  styleUrls: ['./borrower-admin.component.css']
})
export class BorrowerAdminComponent implements OnInit {

  totalBorrowers: number;

  cardNo: number;
  name: string;
  address: string;
  phone: string;

  borrowers: any;

  today = new Date();
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;

  updateBorrowerForm: FormGroup;

  dropdownSettings: any;

  // For CRUD feedback
  feedbackMsg: string;
  feedbackStyle: string;
  
  // Sort
  searchForm: FormGroup;
  searchString: string;

  // Pagination
  pager: any = {};
  pagedResults: any[];
  pageSize: number = 10;

  constructor(
    private lmsService: LmsService,
    private pagerService: PagerService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: "cardNo",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  ngOnInit() {
    this.loadAllBorrowers();
    this.initializeFormGroup();
  }

  // onItemSelect() { }

  initializeFormGroup() {
    this.updateBorrowerForm = new FormGroup({
      name: new FormControl(this.name, [
        Validators.required,
        Validators.maxLength(45),
        Validators.minLength(3),
      ]),
      cardNo: new FormControl(this.cardNo),
      address: new FormControl(this.address),
      phone: new FormControl(this.phone)
    });

    this.searchForm = new FormGroup({
      searchString: new FormControl(this.searchString),
    });
  }

  search() {
    let searchString = this.searchForm.value.searchString;
    let dash = "/";
    if (searchString.length != 0) {
      this.lmsService
        .getAll(
          `${environment.appUrl}${environment.readBorrowersURI}${environment.likeURI}${dash}${searchString}`
        )
        .subscribe(
          (res) => {
            this.borrowers = res;
            this.totalBorrowers = this.borrowers.length;
            this.searchString = "";
            this.setPage(1);
          },
          (error) => {
            this.searchString = "";
          }
        );
    } else {
      this.searchString = "";
      this.loadAllBorrowers();
    }
  }

  loadAllBorrowers() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readBorrowersURI}`)
      .subscribe((res) => {
        this.borrowers = res;
        this.totalBorrowers = this.borrowers.length;
        this.setPage(1);
      },
        (error) => {
          console.log("Error with loadAllBorrowers");
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
    const borrower = {
      cardNo: this.updateBorrowerForm.value.cardNo,
      name: this.updateBorrowerForm.value.name,
      address: this.updateBorrowerForm.value.address,
      phone: this.updateBorrowerForm.value.phone
    }

    // perform insert if no publisher id set
    if (!borrower.cardNo) {
      this.lmsService.postObj(`${environment.appUrl}${environment.updateBorrowersURI}`, borrower)
        .subscribe((res) => {
          this.loadAllBorrowers();
          this.modalService.dismissAll();

          this.feedbackStyle = "successMsg";
          this.feedbackMsg = borrower.name + " was created";
        },
          (error) => {
            this.feedbackStyle = "failureMsg";
            this.feedbackMsg = borrower.name + " could not be created";
          }
        );
    }
    // otherwise, perform update
    else {
      this.lmsService.updateObj(`${environment.appUrl}${environment.updateBorrowersURI}`, borrower)
        .subscribe((res) => {
          this.loadAllBorrowers();
          this.modalService.dismissAll();
        
          this.feedbackStyle = "successMsg";
          this.feedbackMsg = borrower.name + " was updated";
        },
          (error) => {
            this.feedbackStyle = "failureMsg";
            this.feedbackMsg = borrower.name + " could not be updated";
          }
        );
    }
  }

  open(content, obj) {
    if (obj !== null) {
      this.updateBorrowerForm = this.fb.group({
        cardNo: obj.cardNo,
        name: obj.name,
        address: obj.address,
        phone: obj.phone
      })
    } else {
      this.updateBorrowerForm = this.fb.group({
        cardNo: null,
        name: "",
        address: null,
        phone: null
      })
    }

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

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalBorrowers) {
      return 1;
    }
    this.pager = this.pagerService.getPager(this.totalBorrowers, page, this.pageSize);
    this.pagedResults = this.borrowers.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }
}
