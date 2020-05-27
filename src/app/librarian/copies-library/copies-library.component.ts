import { Component, OnInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-copies-library',
  templateUrl: './copies-library.component.html',
  styleUrls: ['./copies-library.component.css']
})
export class CopiesLibraryComponent implements OnInit {

  totalBookCopies: number;
  bookCopies: any;
  today = new Date();
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;
  selectedObj: any;

  constructor(private lmsService: LmsService, private modalService: NgbModal) { }

  ngOnInit() {
    this.loadAllCopies();
  }

  loadAllCopies() {
    this.lmsService.getAll(`${environment.libraryUrl}${environment.readBookCopiesURI}`)
      .subscribe((res) => {
        this.bookCopies = res;
        this.totalBookCopies = this.bookCopies.length;
      },
        (error) => {
          ;
        }
      );
  }

}
