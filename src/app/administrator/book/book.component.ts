import { Component, OnInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { environment } from "../../../environments/environment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  totalBooks: number;
  books: any;
  today = new Date();
  private modalRef: NgbModalRef;
  errMsg: any;
  closeResult: any;
  selectedObj: any;

  constructor(private lmsService: LmsService, private modalService: NgbModal) { }

  ngOnInit() {
    this.loadAllBooks();
  }

  loadAllBooks() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readBooksURI}`)
      .subscribe((res) => {
        this.books = res;
        this.totalBooks = this.books.length;
      },
        (error) => {
          ;
        }
      );
  }

  deleteBook(bookId) {

    this.lmsService.deleteObj(`${environment.appUrl}${environment.deleteBooksURI}`, bookId)
      .subscribe((res) => {
        this.loadAllBooks();
      },
        (error) => {
          ;
        }
      );
  }

  updateBook() {
    this.lmsService.updateObj(`${environment.appUrl}${environment.updateBooksURI}`, this.selectedObj)
      .subscribe((res) => {
        this.loadAllBooks();
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
