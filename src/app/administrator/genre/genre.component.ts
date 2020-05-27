import { Component, OnInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
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

  constructor(
    private lmsService: LmsService,
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
    this.loadAllBooks();
    this.initializeFormGroup();
  }

  onItemSelect() {
    console.log("select");
  }

  initializeFormGroup() {
    this.updateGenreForm = new FormGroup({
      genre_name: new FormControl(this.genre_name, [
        Validators.required,
        Validators.maxLength(45),
        Validators.minLength(3),
      ]),
      genre_id: new FormControl(this.genre_id),
      books: new FormControl(this.books),
    });
  }

  loadAllGenres() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readGenresURI}`)
      .subscribe((res) => {
        this.genres = res;
        this.totalGenres = this.genres.length;
      },
        (error) => {
          ;
        }
      );
  }

  deleteGenre(genre_id) {

    this.lmsService.deleteObj(`${environment.appUrl}${environment.deleteGenresURI}`, genre_id)
      .subscribe((res) => {
        this.loadAllGenres();
      },
        (error) => {
          ;
        }
      );
  }

  updateGenre() {
    const genre = {
      genre_id: this.updateGenreForm.value.genre_id,
      genre_name: this.updateGenreForm.value.genre_name,
      books: this.updateGenreForm.value.books
    }
    this.lmsService.updateObj(`${environment.appUrl}${environment.updateGenresURI}`, genre)
      .subscribe((res) => {
        this.loadAllGenres();
        this.modalService.dismissAll();
      },
        (error) => {
          ;
        }
      );
  }

  open(content, obj) {
    if (obj !== null) {
      this.updateGenreForm = this.fb.group({
        books: [obj.books],
        genre_id: obj.genre_id,
        genre_name: obj.genre_name
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
          ;
        }
      );
  }
}

