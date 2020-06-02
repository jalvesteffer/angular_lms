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
  addBookCopiesForm: FormGroup;
  errMsg: any;
  closeResult: any;
  
  //sort
  searchBookCopiesForm: FormGroup;
  searchString: string;

  //pagnation
  pager: any = {};
  pagedBookCopies: any[];

  //branchs
  totalBranches: any;
  branchDropdownSettings: any;

  //books
  totalBooks: any;
  bookDropdownSettings: any;

  constructor(private lmsService: LmsService, private pagerService: PagerService, private fb: FormBuilder,private modalService: NgbModal)  
    {
      this.branchDropdownSettings = {
        singleSelection: false,
        idField: "branchId",
        textField: "branchName",
        selectAllText: "Select All",
        unSelectAllText: "UnSelect All",
        itemsShowLimit: 5,
        allowSearchFilter: true
      };
  
      this.bookDropdownSettings = {
        singleSelection: false,
        idField: "bookId",
        textField: "title",
        selectAllText: "Select All",
        unSelectAllText: "UnSelect All",
        itemsShowLimit: 5,
        allowSearchFilter: true
      };
  }

  ngOnInit() {
    this.loadAllCopies();
    this.initializeFormGroup();
  }
  
  ngAfterViewInit() {}

  async initializeFormGroup() {
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
    this.addBookCopiesForm = new FormGroup({
    branchName: new FormControl(this.branchName)
  });
  }

  async loadAllCopies() {
    this.lmsService.getAll(`${environment.libraryUrl}${environment.readBookCopiesURI}`)
      .subscribe((res) => {
        this.bookCopies = res;
        this.totalBookCopies = this.bookCopies.length;
        this.setPage(1);
        console.log(this.bookCopies);

        this.loadAllBranches();
      },
        (error) => {
          ;
        }
      );
  }

  async loadAllBranches() {
    this.lmsService.getAll(`${environment.libraryUrl}${environment.readBranchesURI}`)
      .subscribe((res) => {
        this.totalBranches = res;
        this.loadAllBooks();
      },
        (error) => {
          ;
        }
      );
  }

  async loadAllBooks() {
    this.lmsService.getAll(`${environment.libraryUrl}${environment.readBooksURI}`)
      .subscribe((res) => {
        this.totalBooks = res;
        console.log(this.totalBooks);
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
            this.setPage(1);
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

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalBookCopies) {
      return;
    }
    this.pager = this.pagerService.getPager(this.totalBookCopies, page, 10);
    this.pagedBookCopies = this.bookCopies.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }

}
