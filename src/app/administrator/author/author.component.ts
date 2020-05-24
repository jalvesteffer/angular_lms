import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {

  totalAuthors: number;
  authors: any;
  today = new Date();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadAllAuthors();
  }

  ngAfterViewInit() { }

  loadAllAuthors() {
    this.http.get('http://localhost:3000/lms/admin/authors')
      .subscribe((res) => {
        this.authors = res;
        this.totalAuthors = this.authors.length;
      },
        (error) => {
          ;
        }
      );
  }
}
