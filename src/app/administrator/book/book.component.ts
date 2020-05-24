import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  totalBooks: number;
  books: any;
  today = new Date();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadAllBooks();
  }

  loadAllBooks() {
    this.http.get('http://localhost:3000/lms/admin/books')
      .subscribe((res) => {
        this.books = res;
        this.totalBooks = this.books.length;
      },
        (error) => {
          ;
        }
      );
  }

}
