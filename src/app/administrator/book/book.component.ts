import { Component, OnInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { PagerService } from "../../common/services/pager.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms"
import { log } from 'util';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  totalAuthors: any;
  totalBooks: number;
  totalPublishers: any;
  totalGenres: any;

  bookId: number;
  title: string;
  pubId: number;

  authors: any;
  books: any;
  publisher: any;
  publisherVal: any; // used for null check in updateBook()
  genres: any;

  today = new Date();
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;
  selectedObj: any;
  updateBookForm: FormGroup;

  authorsDropdownSettings: any;
  genresDropdownSettings: any;
  publishersDropdownSettings: any;

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
    this.authorsDropdownSettings = {
      singleSelection: false,
      idField: "authorId",
      textField: "authorName",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.genresDropdownSettings = {
      singleSelection: false,
      idField: "genre_id",
      textField: "genre_name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.publishersDropdownSettings = {
      singleSelection: true,
      idField: "publisherId",
      textField: "publisherName",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  ngOnInit() {

    this.loadAllBooks();
    this.initializeFormGroup();
  }

  initializeFormGroup() {
    this.updateBookForm = new FormGroup({
      bookId: new FormControl(this.bookId),
      title: new FormControl(this.title, [
        Validators.required,
        Validators.maxLength(45),
        Validators.minLength(3),
      ]),
      pubId: new FormControl(this.pubId),
      authors: new FormControl(this.authors),
      publisher: new FormControl(this.publisher),
      genres: new FormControl(this.genres)
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
          `${environment.appUrl}${environment.readBooksURI}${environment.likeURI}${dash}${searchString}`
        )
        .subscribe(
          (res) => {
            this.books = res;
            this.totalBooks = this.books.length;
            this.searchString = "";
            this.setPage(1);
          },
          (error) => {
            this.searchString = "";
          }
        );
    } else {
      this.searchString = "";
      this.loadAllBooks();
    }
  }

  // ngAfterViewInit() { }
  // onItemSelect() { }

  async loadAllAuthors() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readAuthorsURI}`)
      .subscribe((res) => {
        this.totalAuthors = res;

        console.log(res);
        console.log(this.totalAuthors.length);

        this.loadAllPublishers();

      },
        (error) => {
          console.log('Error with loadAllAuthors');
        }
      );
  }

  async loadAllBooks() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readBooksURI}`)
      .subscribe((res) => {
        this.books = res;
        this.totalBooks = this.books.length;
        this.setPage(1);
      },
        (error) => {
          console.log('Error with loadAllBooks');
        }
      );
  }

  async loadAllPublishers() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readPublishersURI}`)
      .subscribe((res) => {
        this.totalPublishers = res;

        this.loadAllGenres();
      },
        (error) => {
          console.log("Error with loadAllPublishers");
        }
      );
  }

  async loadAllGenres() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readGenresURI}`)
      .subscribe((res) => {
        this.totalGenres = res;
      },
        (error) => {
          console.log('Error with loadAllGenres');
        }
      );
  }

  deleteBook(book) {
    this.lmsService.deleteObj(`${environment.appUrl}${environment.deleteBooksURI}`, book.bookId)
      .subscribe((res) => {
        this.loadAllBooks();
        this.feedbackStyle = "successMsg";
        this.feedbackMsg = book.title + " was deleted";
      },
        (error) => {
          this.feedbackStyle = "failureMsg";
          this.feedbackMsg = book.title + " could not be deleted";
        }
      );
  }

  updateBook() {
    // check for null value before getting publisherId at [0] index
    if (!this.updateBookForm.value.publisher) {
      this.publisherVal = null;
    } else {
      this.publisherVal = this.updateBookForm.value.publisher[0].publisherId;
    }

    const book = {
      bookId: this.updateBookForm.value.bookId,
      title: this.updateBookForm.value.title,
      pubId: this.publisherVal,
      authors: this.updateBookForm.value.authors,
      genres: this.updateBookForm.value.genres
    }

    // perform insert if no author id set
    if (!book.bookId) {
      this.lmsService.postObj(`${environment.appUrl}${environment.createBooksURI}`, book)
        .subscribe((res) => {
          this.loadAllBooks();
          this.modalService.dismissAll();

          this.feedbackStyle = "successMsg";
          this.feedbackMsg = book.title + " was created";
        },
          (error) => {
            this.feedbackStyle = "failureMsg";
            this.feedbackMsg = book.title + " could not be created";
          }
        );
    }
    // otherwise, perform update
    else {
      this.lmsService.updateObj(`${environment.appUrl}${environment.updateBooksURI}`, book)
        .subscribe((res) => {
          this.loadAllBooks();
          this.modalService.dismissAll();

          this.feedbackStyle = "successMsg";
          this.feedbackMsg = book.title + " was updated";
        },
          (error) => {
            this.feedbackStyle = "failureMsg";
            this.feedbackMsg = book.title + " could not be updated";
          }
        );
    }
  }

  open(content, obj) {

    this.loadAllAuthors();

    if (obj !== null) {
      this.updateBookForm = this.fb.group({
        bookId: obj.bookId,
        title: obj.title,
        pubId: obj.pubId,
        publisherName: obj.publisherName,
        publisher: [obj.publisher],
        authors: [obj.authors],
        genres: [obj.genres]
      })
    } else {
      this.updateBookForm = this.fb.group({
        bookId: null,
        title: "",
        pubId: null,
        publisherName: "",
        publisher: null,
        authors: null,
        genres: null
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
    if (page < 1 || page > this.pager.totalBooks) {
      return 1;
    }
    this.pager = this.pagerService.getPager(this.totalBooks, page, this.pageSize);
    this.pagedResults = this.books.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }
}
