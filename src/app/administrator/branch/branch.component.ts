import { Component, OnInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private lmsService: LmsService, private modalService: NgbModal) { }

  ngOnInit() {
    this.loadAllBranches();
  }

  loadAllBranches() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readBranchesURI}`)
      .subscribe((res) => {
        this.branches = res;
        this.totalBranches = this.branches.length;
      },
        (error) => {
          ;
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
    this.lmsService.updateObj(`${environment.appUrl}${environment.updateBranchesURI}`, this.selectedObj)
      .subscribe((res) => {
        this.loadAllBranches();
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
