import { Component, OnInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { PagerService } from "../../common/services/pager.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms"

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.css']
})
export class GenreComponent implements OnInit {

  totalGenres: number;
  genres: any;
  today = new Date();
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;
  selectedObj: any;
  updateGenreForm: FormGroup;
  genre_name: string;
  genre_id: number;
  books: any;
  totalBooks: any;
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
      idField: "bookId",
      textField: "title",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  ngOnInit() {
    this.loadAllGenres();
    this.initializeFormGroup();
  }

  // onItemSelect() { }

  initializeFormGroup() {
    this.updateGenreForm = new FormGroup({
      genre_name: new FormControl(this.genre_name),
      genre_id: new FormControl(this.genre_id),
      books: new FormControl(this.books),
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
          `${environment.appUrl}${environment.readGenresURI}${environment.likeURI}${dash}${searchString}`
        )
        .subscribe(
          (res) => {
            this.genres = res;
            this.totalGenres = this.genres.length;
            this.searchString = "";
            this.setPage(1);
          },
          (error) => {
            this.searchString = "";
          }
        );
    } else {
      this.searchString = "";
      this.loadAllGenres();
    }
  }

  loadAllGenres() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readGenresURI}`)
      .subscribe((res) => {
        this.genres = res;
        this.totalGenres = this.genres.length;
        this.setPage(1);
      },
        (error) => {
          ;
        }
      );
  }

  deleteGenre(genre) {

    this.lmsService.deleteObj(`${environment.appUrl}${environment.deleteGenresURI}`, genre.genre_id)
      .subscribe((res) => {
        this.loadAllGenres();
        this.feedbackStyle = "successMsg";
        this.feedbackMsg = genre.genre_name + " was deleted";
      },
        (error) => {
          this.feedbackStyle = "failureMsg";
          this.feedbackMsg = genre.genre_name + " could not be deleted";
        }
      );
  }

  updateGenre() {
    const genre = {
      genre_id: this.updateGenreForm.value.genre_id,
      genre_name: this.updateGenreForm.value.genre_name,
      books: this.updateGenreForm.value.books
    }

    // perform insert if no author id set
    if (!genre.genre_id) {
      this.lmsService.postObj(`${environment.appUrl}${environment.createGenresURI}`, genre)
        .subscribe((res) => {
          this.loadAllGenres();
          this.modalService.dismissAll();

          this.feedbackStyle = "successMsg";
          this.feedbackMsg = genre.genre_name + " was created";
        },
          (error) => {
            this.feedbackStyle = "failureMsg";
            this.feedbackMsg = genre.genre_name + " could not be created";
          }
        );
    }
    // otherwise, perform update
    else {
      this.lmsService.updateObj(`${environment.appUrl}${environment.updateGenresURI}`, genre)
        .subscribe((res) => {
          this.loadAllGenres();
          this.modalService.dismissAll();

          this.feedbackStyle = "successMsg";
          this.feedbackMsg = genre.genre_name + " was updated";
        },
          (error) => {
            this.feedbackStyle = "failureMsg";
            this.feedbackMsg = genre.genre_name + " could not be updated";
          }
        );
    }
  }

  open(content, obj) {
    this.loadAllBooks();

    if (obj !== null) {
      this.updateGenreForm = this.fb.group({
        books: [obj.books],
        genre_id: obj.genre_id,
        genre_name: [obj.genre_name, [Validators.required, Validators.minLength(3), Validators.maxLength(45)]]
      })
    } else {
      this.updateGenreForm = this.fb.group({
        books: null,
        genre_id: null,
        genre_name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(45)]]
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

  loadAllBooks() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readBooksURI}`)
      .subscribe((res) => {
        this.totalBooks = res;
      },
        (error) => {
          console.log("Error loading all books");
          ;
        }
      );
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalGenres) {
      return 1;
    }
    this.pager = this.pagerService.getPager(this.totalGenres, page, this.pageSize);
    this.pagedResults = this.genres.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }
}

