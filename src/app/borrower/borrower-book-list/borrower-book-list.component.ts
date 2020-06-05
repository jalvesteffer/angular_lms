import { Component, OnInit } from '@angular/core';
import { Book } from '../book';
import { BorrowerService} from '../../common/services/borrower.service';

@Component({
  selector: 'app-borrower-book-list',
  templateUrl: './borrower-book-list.component.html',
  styleUrls: ['./borrower-book-list.component.css']
})
export class BorrowerBookListComponent implements OnInit {
  books: Book[];

  constructor(private lms: BorrowerService) {}
  
  ngOnInit() {
    this.lms.getAllBooks().subscribe((res) => {
      this.books = res;
    });
  }
  
}
