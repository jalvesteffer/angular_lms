import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LmsService } from "../../common/services/lms.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {

  totalAuthors: number;
  authors: any;
  today = new Date();

  constructor(private lmsService: LmsService) { }

  ngOnInit() {
    this.loadAllAuthors();
  }

  ngAfterViewInit() { }

  loadAllAuthors() {
    this.lmsService.getAll(`${environment.appUrl}${environment.readAuthorsURI}`)
      .subscribe((res) => {
        this.authors = res;
        this.totalAuthors = this.authors.length;
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
}
