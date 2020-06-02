import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { PagerService } from "../../common/services/pager.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";

@Component({
  selector: 'app-branch-library',
  templateUrl: './branch-library.component.html',
  styleUrls: ['./branch-library.component.css']
})
export class BranchLibraryComponent implements OnInit {
  totalBranches: number;
  branches: any;
  branchName:string;
  branchAddress:string;
  branchId: number;
  today = new Date();
  private modalRef: NgbModalRef;
  updateBranchForm: FormGroup;
  errMsg: any;
  closeResult: any;
  selectedObj: any;

  //sort
  searchBranchForm: FormGroup;
  searchString: string;

  //pagnation
  pager: any = {};
  pagedBranch: any[];
  pageSize: number = 10;

  constructor(private lmsService: LmsService, private pagerService: PagerService, private fb: FormBuilder,private modalService: NgbModal) { }

  ngOnInit() {
    this.loadAllBranches();
    this.initializeFormGroup();
  }
  ngAfterViewInit() {}

  initializeFormGroup() {
    this.updateBranchForm = new FormGroup({
      branchName: new FormControl(this.branchName, [
        Validators.required,
        Validators.maxLength(45),
        Validators.minLength(3),
      ]),
      branchAddress: new FormControl(this.branchName, [
        Validators.required,
        Validators.maxLength(45),
        Validators.minLength(9),
      ]),
      branchId: new FormControl(this.branchId)
    });
    this.searchBranchForm = new FormGroup({
      searchString: new FormControl(this.searchString),
    });
  }

  loadAllBranches() {
    this.lmsService.getAll(`${environment.libraryUrl}${environment.readBranchesURI}`)
      .subscribe((res) => {
        this.branches = res;
        this.totalBranches = this.branches.length;
        this.setPage(1);
      },
        (error) => {
          ;
        }
      );
  }

  searchBranches() {
    let searchString = this.searchBranchForm.value.searchString;
    let dash = "/";
    if(searchString.length != ""){ 
      this.lmsService
        .getAll(
          `${environment.libraryUrl}${environment.readBranchesURI}${environment.likeURI}${dash}${searchString}`
        )
        .subscribe(
          (res) => {
            this.branches= res;
            this.totalBranches = this.branches.length;
            this.searchString = "";
            this.setPage(1);
          },
          (error) => {
            this.searchString = "";
          }
        );
      }else{
        this.searchString = "";
        this.loadAllBranches();
      }
  }

  updateBranch() {
    const branch = {
      branchId: this.updateBranchForm.value.branchId,
      branchName: this.updateBranchForm.value.branchName,
      branchAddress: this.updateBranchForm.value.branchAddress,
    };
    this.lmsService
      .updateObj(`${environment.libraryUrl}${environment.updateLibraryBranchesURI}`, branch)
      .subscribe(
        (res) => {
          this.loadAllBranches();
          this.modalService.dismissAll();
        },
        (error) => {
        }
      );
  }

  open(content, obj) {
    if (obj !== null) {
      //this is edit/update mode
      this.branchName = obj.branchName,
      this.updateBranchForm = this.fb.group({
        branchId: obj.branchId,
        branchName: obj.branchName,
        branchAddress: obj.branchAddress,
      });
    }else{
      this.branchName = "",
      this.updateBranchForm = this.fb.group({
        branchId: null,
        branchName: "",
        branchAddress: null,
      });
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
    this.pager = this.pagerService.getPager(this.totalBranches, page, this.pageSize);
    this.pagedBranch = this.branches.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }
}