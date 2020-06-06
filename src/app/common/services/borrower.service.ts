import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Book } from "src/app/borrower/book";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class BorrowerService {
  apiRoot: string = "http://localhost:3000/borrowers/1";
  
  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<Book[]> {
    return this.http
      .get<Book[]>(`${this.apiRoot}/branches/1/books`)
      .pipe(
        map((res) =>
          res.map((b) => new Book(b.bookId, b.branchId, b.noOfCopies, b.title))
        )
      );
  }

  getAllBranches(): Observable<Book[]> {
    return this.http
      .get<Book[]>(`${this.apiRoot}/branches/1/books`)
      .pipe(
        map((res) =>
          res.map((b) => new Book(b.bookId, b.branchId, b.noOfCopies, b.title))
        )
      );
  }

  search(searchTerm): Observable<Book[]> {
    return this.http
      .get<Book[]>(`${this.apiRoot}/branches/1/books`)
      .pipe(
        map((res) =>
          res.map((b) => new Book(b.bookId, b.branchId, b.noOfCopies, b.title))
        )
      );
  }
}
