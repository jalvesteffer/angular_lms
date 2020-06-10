import { Component, OnInit } from "@angular/core";
import { Book } from "../book";
import { BorrowerService } from "../../common/services/borrower.service";

@Component({
  selector: "app-borrower-book-list",
  templateUrl: "./borrower-book-list.component.html",
  styleUrls: ["./borrower-book-list.component.css"],
})
export class BorrowerBookListComponent implements OnInit {
  books: Book[];

  constructor(private lms: BorrowerService) { 
    lms.bookReturned.subscribe(obs => {
      this.getBooks();
    })
    lms.search.subscribe(term => {
      this.lms.searchBooks(term).subscribe((res) => {
        this.books = res;
      })
    }) 
  }

  onClicked(book: Book) {
    this.lms.borrowBook(book).subscribe((res) => {      
      this.getBooks();
      this.lms.bookBorrowed.next();
    });
  }

  getBooks() {
    this.lms.getAllBooks().subscribe((res) => {
      this.books = res;
    });
  }

  ngOnInit() {
    this.getBooks();
  }
}
