import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Book } from "src/app/borrower/book";
import { Branch } from "src/app/borrower/branch";
import { Loan } from 'src/app/borrower/loan';
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class BorrowerService {
  
  apiRoot: string = "http://localhost:3000/borrowers/1";
  
  bookBorrowed = new Subject();
  bookReturned = new Subject();
  search = new Subject<string>();

  bookBorrowed$ = this.bookBorrowed.asObservable();  
  bookReturned$ = this.bookBorrowed.asObservable();
  search$ = this.search.asObservable();
  
  constructor(private http: HttpClient) { }

  getAllBooks(): Observable<Book[]> {
    return this.http
      .get<Book[]>(`${this.apiRoot}/branches/1/books`)
      .pipe(
        map((res) =>
          res.map((b) => new Book(b.bookId, b.branchId, b.noOfCopies, b.title))
        )
      );
  }

  getAllBranches(): Observable<Branch[]> {
    return this.http
      .get<Branch[]>(`${this.apiRoot}/branches`)
      .pipe(
        map((res) =>
          res.map((b) => new Branch(b.branchId, b.branchName, b.branchAddress))
        )
      );
  }

  getAllLoans(): Observable<Loan[]> {
    return this.http
      .get<Loan[]>(`${this.apiRoot}/loans`)
      .pipe(
        map((res) =>
          res.map((l) => new Loan(l.loanId, l.bookId, l.branchId, l.cardNo, l.dateOut, l.dueDate))
        )
      );
  }

  searchBooks(term): Observable<Book[]> {
    console.log(term)
    return null
  }

  borrowBook(book: Book) : Observable<any> {
    return this.http.post(`${this.apiRoot}/branches/1/books`, book);
  }

  returnLoan(loan : Loan) : Observable<any> {
    return this.http.put(`${this.apiRoot}/loans`, loan);
  }

  returned() {
    this.bookReturned.next();
  }

  borrowed() {
    this.bookBorrowed.next();
  }

  searched(term: string) {
    this.search.next(term);
  }

}
