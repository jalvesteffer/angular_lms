import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";

@Component({
  selector: 'app-copies-library',
  templateUrl: './copies-library.component.html',
  styleUrls: ['./copies-library.component.css']
})
export class CopiesLibraryComponent implements OnInit {

  totalBookCopies: number;
  bookCopies: any;
  branchName: string;
  bookId: number;
  branchId: number;
  noOfCopies: number;
  title: string;
  today = new Date();
  private modalRef: NgbModalRef;
  updateBookCopiesForm: FormGroup;
  errMsg: any;
  closeResult: any;
  
  
  searchBookCopiesForm: FormGroup;
  searchString: string;

  constructor(private lmsService: LmsService, private fb: FormBuilder,private modalService: NgbModal) { }

  ngOnInit() {
    this.loadAllCopies();
    this.initializeFormGroup();
  }
  ngAfterViewInit() {}

  initializeFormGroup() {
    this.updateBookCopiesForm = new FormGroup({
      noOfCopies: new FormControl(this.noOfCopies, [
        Validators.required,
        Validators.min(0),
      ]),
      bookId: new FormControl(this.bookId),
      branchId: new FormControl(this.branchId)
    });
    this.searchBookCopiesForm = new FormGroup({
      searchString: new FormControl(this.searchString),
    });
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

  searchBookCopies() {
    let searchString = this.searchBookCopiesForm.value.searchString;
    let dash = "/";
    if(searchString.length != ""){ 
      this.lmsService
        .getAll(
          `${environment.libraryUrl}${environment.readBookCopiesURI}${environment.likeURI}${dash}${searchString}`
        )
        .subscribe(
          (res) => {
            this.bookCopies = res;
            this.totalBookCopies = this.bookCopies.length;
            this.searchString = "";
          },
          (error) => {
            this.searchString = "";
          }
        );
      }else{
        this.searchString = "";
        this.loadAllCopies();
      }
  }

  updateBookCopies() {
    const bookCopy = {
      bookId: this.updateBookCopiesForm.value.bookId,
      branchId: this.updateBookCopiesForm.value.branchId,
      noOfCopies: this.updateBookCopiesForm.value.noOfCopies
    }
    this.lmsService.updateObj(`${environment.libraryUrl}${environment.updateBookCopiesURI}`, bookCopy)
      .subscribe((res) => {
        this.loadAllCopies();
        this.modalService.dismissAll();
      },
        (error) => {
        }
      );
  }

  open(content, obj) {
    if (obj !== null) {
      this.branchName = obj.branchName,
      this.title = obj.title,
      this.updateBookCopiesForm = this.fb.group({
        noOfCopies: obj.noOfCopies,
        branchId: obj.branchId,
        bookId: obj.bookId,
      })
    }else{
      this.branchName = "",
      this.title = "",
      this.updateBookCopiesForm = this.fb.group({
        noOfCopies: null,
        branchId: null,
        bookId: null,
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

}
