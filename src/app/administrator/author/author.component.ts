import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { PagerService } from "../../common/services/pager.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {

  totalAuthors: number;
  authors: any;
  today = new Date();
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;
  selectedObj: any;
  updateAuthorForm: FormGroup;
  authorName: string;
  authorId: number;
  books: any;
  totalBooks: any;
  dropdownSettings: any;

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
      idField: "bookId",
      textField: "title",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  ngOnInit() {
    this.loadAllAuthors();
    this.initializeFormGroup();
  }

  ngAfterViewInit() { }

  onItemSelect() {
    console.log("select");
  }

  initializeFormGroup() {
    this.updateAuthorForm = new FormGroup({
      authorName: new FormControl(this.authorName, [
        Validators.required,
        Validators.maxLength(45),
        Validators.minLength(3),
      ]),
      authorId: new FormControl(this.authorId),
      books: new FormControl(this.books),
    });

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
          `${environment.appUrl}${environment.readAuthorsURI}${environment.likeURI}${dash}${searchString}`
        )
        .subscribe(
          (res) => {
            this.authors = res;
            this.totalAuthors = this.authors.length;
            this.searchString = "";
            this.setPage(1);
          },
          (error) => {
            this.searchString = "";
          }
        );
    } else {
      this.searchString = "";
      this.loadAllAuthors();
    }
  }

  loadAllAuthors() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readAuthorsURI}`)
      .subscribe((res) => {
        this.authors = res;
        this.totalAuthors = this.authors.length;
        this.setPage(1);
      },
        (error) => {
          ;
        }
      );
  }

  loadAllBooks() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readBooksURI}`)
      .subscribe((res) => {
        this.totalBooks = res;
      },
        (error) => {
          ;
        }
      );
  }

  deleteAuthor(authorId) {

    this.lmsService.deleteObj(`${environment.appUrl}${environment.deleteAuthorsURI}`, authorId)
      .subscribe((res) => {
        this.loadAllAuthors();
      },
        (error) => {
          ;
        }
      );
  }

  updateAuthor() {
    const author = {
      authorId: this.updateAuthorForm.value.authorId,
      authorName: this.updateAuthorForm.value.authorName,
      books: this.updateAuthorForm.value.books
    }

    // perform insert if no author id set
    if (!author.authorId) {
      this.lmsService.postObj(`${environment.appUrl}${environment.createAuthorsURI}`, author)
        .subscribe((res) => {
          this.loadAllAuthors();
          this.modalService.dismissAll();
        },
          (error) => {
            console.log("error creating new author");
          }
        );
    }
    // otherwise, perform update
    else {
      this.lmsService.updateObj(`${environment.appUrl}${environment.updateAuthorsURI}`, author)
        .subscribe((res) => {
          this.loadAllAuthors();
          this.modalService.dismissAll();
        },
          (error) => {
            ;
          }
        );
    }
  }

  open(content, obj) {
    this.loadAllBooks();

    if (obj !== null) {
      this.updateAuthorForm = this.fb.group({
        books: [obj.books],
        authorId: obj.authorId,
        authorName: obj.authorName
      })
    } else {
      this.updateAuthorForm = this.fb.group({
        books: null,
        authorId: null,
        authorName: ""
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
    if (page < 1 || page > this.pager.totalAuthors) {
      return;
    }
    this.pager = this.pagerService.getPager(this.totalAuthors, page, this.pageSize);
    this.pagedResults = this.authors.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }
}
