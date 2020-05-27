import { Component, OnInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-branch-library',
  templateUrl: './branch-library.component.html',
  styleUrls: ['./branch-library.component.css']
})
export class BranchLibraryComponent implements OnInit {
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
    this.lmsService.getAll(`${environment.libraryUrl}${environment.readBranchesURI}`)
      .subscribe((res) => {
        this.branches = res;
        this.totalBranches = this.branches.length;
      },
        (error) => {
          ;
        }
      );
  }

  // updateBranch() {
  //   this.lmsService.updateObj(`${environment.libraryUrl}${environment.updateLibraryBranchesURI}`, this.selectedObj)
  //     .subscribe((res) => {
  //       this.loadAllBranches();
  //       this.modalService.dismissAll();
  //     },
  //       (error) => {
  //         ;
  //       }
  //     );
  // }

  // open(content, obj) {
  //   this.selectedObj = obj;
  //   this.modalRef = this.modalService.open(content);
  //   this.modalRef.result.then(
  //     (result) => {
  //       this.errMsg = "";
  //       this.closeResult = `Closed with ${result}`;
  //     },
  //     (reason) => {
  //       this.errMsg = "";
  //       this.closeResult = `Dismissed`;
  //     }
  //   );
  // }
}