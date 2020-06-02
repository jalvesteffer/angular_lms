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

  // Pagination
  pager: any = {};
  pagedResults: any[];

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

  onItemSelect() { }

  initializeFormGroup() {
    this.updateBranchForm = new FormGroup({
      branchName: new FormControl(this.branchName, [
        Validators.required,
        Validators.maxLength(45),
        Validators.minLength(3),
      ]),
      branchId: new FormControl(this.branchId),
      branchAddress: new FormControl(this.branchAddress)
    });
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

  deleteBranch(branchId) {

    this.lmsService.deleteObj(`${environment.appUrl}${environment.deleteBranchesURI}`, branchId)
      .subscribe((res) => {
        this.loadAllBranches();
      },
        (error) => {
          ;
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
        },
          (error) => {
            console.log("error with postObj");
          }
        );
    }
    // otherwise, perform update
    else {
      this.lmsService.updateObj(`${environment.appUrl}${environment.updateBranchesURI}`, branch)
        .subscribe((res) => {
          this.loadAllBranches();
          this.modalService.dismissAll();
        },
          (error) => {
            console.log("error with updateObj");
          }
        );
    }
  }

  open(content, obj) {
    if (obj !== null) {
      this.updateBranchForm = this.fb.group({
        branchId: obj.branchId,
        branchName: obj.branchName,
        branchAddress: obj.branchAddress
      })
    } else {
      this.updateBranchForm = this.fb.group({
        branchId: null,
        branchName: "",
        branchAddress: null
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
      return;
    }
    this.pager = this.pagerService.getPager(this.totalBranches, page, 10);
    this.pagedResults = this.branches.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }
}
