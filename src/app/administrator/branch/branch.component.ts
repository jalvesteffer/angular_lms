import { Component, OnInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { PagerService } from "../../common/services/pager.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms"

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {

  totalBranches: number;
  branches: any;
  today = new Date();
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;
  selectedObj: any;
  updateBranchForm: FormGroup;
  branchName: string;
  branchId: number;
  branchAddress: string;
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
      idField: "branchId",
      textField: "branchName",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  ngOnInit() {
    this.loadAllBranches();
    this.initializeFormGroup();
  }

  // onItemSelect() { }

  initializeFormGroup() {
    this.updateBranchForm = new FormGroup({
      branchName: new FormControl(this.branchName),
      branchId: new FormControl(this.branchId),
      branchAddress: new FormControl(this.branchAddress)
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
          `${environment.appUrl}${environment.readBranchesURI}${environment.likeURI}${dash}${searchString}`
        )
        .subscribe(
          (res) => {
            this.branches = res;
            this.totalBranches = this.branches.length;
            this.searchString = "";
            this.setPage(1);
          },
          (error) => {
            this.searchString = "";
          }
        );
    } else {
      this.searchString = "";
      this.loadAllBranches();
    }
  }

  loadAllBranches() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readBranchesURI}`)
      .subscribe((res) => {
        this.branches = res;
        this.totalBranches = this.branches.length;
        this.setPage(1);
      },
        (error) => {
          console.log("Error with loadAllBranches");
        }
      );
  }

  deleteBranch(branch) {

    this.lmsService.deleteObj(`${environment.appUrl}${environment.deleteBranchesURI}`, branch.branchId)
      .subscribe((res) => {
        this.loadAllBranches();
        this.feedbackStyle = "successMsg";
        this.feedbackMsg = branch.branchName + " was deleted";
      },
        (error) => {
          this.feedbackStyle = "failureMsg";
          this.feedbackMsg = branch.branchName + " could not be deleted";
        }
      );
  }

  updateBranch() {
    const branch = {
      branchId: this.updateBranchForm.value.branchId,
      branchName: this.updateBranchForm.value.branchName,
      branchAddress: this.updateBranchForm.value.branchAddress,
    }

    // perform insert if no publisher id set
    if (!branch.branchId) {
      this.lmsService.postObj(`${environment.appUrl}${environment.createBranchesURI}`, branch)
        .subscribe((res) => {
          this.loadAllBranches();
          this.modalService.dismissAll();

          this.feedbackStyle = "successMsg";
          this.feedbackMsg = branch.branchName + " was created";
        },
          (error) => {
            this.feedbackStyle = "failureMsg";
            this.feedbackMsg = branch.branchName + " could not be created";
          }
        );
    }
    // otherwise, perform update
    else {
      this.lmsService.updateObj(`${environment.appUrl}${environment.updateBranchesURI}`, branch)
        .subscribe((res) => {
          this.loadAllBranches();
          this.modalService.dismissAll();

          this.feedbackStyle = "successMsg";
          this.feedbackMsg = branch.branchName + " was updated";
        },
          (error) => {
            this.feedbackStyle = "failureMsg";
            this.feedbackMsg = branch.branchName + " could not be updated";
          }
        );
    }
  }

  open(content, obj) {
    if (obj !== null) {
      this.updateBranchForm = this.fb.group({
        branchId: obj.branchId,
        branchName: [obj.branchName, [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
        branchAddress: [obj.branchAddress, [Validators.minLength(3), Validators.maxLength(45)]]
      })
    } else {
      this.updateBranchForm = this.fb.group({
        branchId: null,
        branchName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
        branchAddress: ["", [Validators.minLength(3), Validators.maxLength(45)]]
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
    if (page < 1 || page > this.pager.totalBranches) {
      return 1;
    }
    this.pager = this.pagerService.getPager(this.totalBranches, page, this.pageSize);
    this.pagedResults = this.branches.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }
}
